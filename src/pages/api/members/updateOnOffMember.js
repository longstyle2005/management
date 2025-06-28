import { ObjectId } from 'mongodb';
import clientPromise from "~/lib/mongodb/mongodb";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const client = await clientPromise;
    const db = client.db('Management');
    const membersCollection = db.collection('members');
    const roleCollection = db.collection("project_roles");

    const { 
        memberId,
        off,
    } = req.body;  

    try {
        if (!memberId || typeof memberId !== 'string') {
            return res.status(400).json({ message: 'Invalid memberId' });
        }

        const resultUpdateOnOff = await membersCollection.updateOne(
            { _id: new ObjectId(memberId) },
            { $set: 
                { 
                    off,
                    updatedAt: new Date(),
                }
            } 
        );

        const resultUpdateStatusProject = await roleCollection.updateMany(
            { memberId: new ObjectId(memberId) },
            { $set: 
                {
                    status: '0',
                    updatedAt: new Date(),
                }
            } 
        );
    
        return res.status(200).json({ message: "Member off status updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update off status' });
    }
}