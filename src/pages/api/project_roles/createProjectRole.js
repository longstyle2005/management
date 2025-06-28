import { ObjectId } from 'mongodb';
import clientPromise from "~/lib/mongodb/mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db('Management');
    const dbMember = await db.collection('members');
    const dbProject = await db.collection('projects');

    if (req.method === 'POST') {
        const { 
            memberId,
            projectId,
            role,
            status,
            isCurrent,
        } = req.body;  

        try {
            const result = await dbProject.insertOne({ 
                memberId,
                projectId,
                role,
                status,
                isCurrent,
            });
            
            // Update project id for member
            const projectId = result.insertedId;
            await dbMember.updateMany(
                { _id: { $in: members.map((id) => new ObjectId(id)) } },
                { $addToSet: { project_list: projectId } }
            );
            return res.status(200).json({ message: "Project created successfully!" });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to create Project' });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}