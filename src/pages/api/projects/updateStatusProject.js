import { ObjectId } from 'mongodb';
import clientPromise from "~/lib/mongodb/mongodb";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const client = await clientPromise;
    const db = client.db('Management');
    const projectsCollection  = await db.collection('projects');

    const { 
        projectId,
        status,
        situation,
    } = req.body;  

    try {
        if (!projectId || typeof projectId !== 'string') {
            return res.status(400).json({ message: 'Invalid projectId' });
        }

        const resultUpdateSatus = await projectsCollection.updateOne(
            { _id: new ObjectId(projectId) },
            { $set: 
                { 
                    status,
                    situation,
                    updatedAt: new Date(),
                }
            } 
        );
    
        return res.status(200).json({ message: "Project status updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update project status' });
    }
}