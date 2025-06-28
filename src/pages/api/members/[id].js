import { ObjectId } from 'mongodb';
import clientPromise from "~/lib/mongodb/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth/auth";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const client = await clientPromise;
    const db = client.db('Management');
    const dbMember = await db.collection('members');
    const { id } = req.query;

    const loggedInUser = await dbMember.findOne({
        email: session.user.email,
    });
  
    if (!loggedInUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const {  
        avatar,
        nickname,
        email,
        team,
        position,
        off,
        role,
    } = req.body;

    if (
        loggedInUser.role !== "admin" && // Admin has full authority
        loggedInUser._id.toString() !== id // Members can only update themselves
    ) {
        return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    try {
        const existingMember = await dbMember.findOne({ _id: new ObjectId(id) });
        if (!existingMember) {
            return res.status(404).json({ message: 'Member not found' });
        }

        if (nickname && nickname !== existingMember.nickname) {
            const nicknameExists = await dbMember.findOne({ nickname, _id: { $ne: new ObjectId(id) } });
            if (nicknameExists) {
                return res.status(400).json({ message: 'Nickname already exists' });
            }
        }

        const resultUpdatedMember = await dbMember.updateOne(
            { _id: new ObjectId(id) }, // Find Member by ID
            { $set: 
                { 
                    avatar,
                    nickname,
                    email,
                    team,
                    position,
                    off,
                    role,
                    updatedAt: new Date(),
                }
            } // Update fields
        );
        return res.status(200).json({ message: 'Member updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update Member' });
    }
}