import { ObjectId } from 'mongodb';
import clientPromise from "~/lib/mongodb/mongodb";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const client = await clientPromise;
    const db = client.db('Management');
    const projectRolesCollection = await db.collection('project_roles');

    const { 
        memberId,
        projectRoleId,
    } = req.body;  

    try {

        if (!memberId || typeof memberId !== 'string' || !projectRoleId || typeof projectRoleId !== 'string') {
            return res.status(400).json({ message: 'Invalid ProjectRoleId' });
        }

        await projectRolesCollection.updateMany(
            { memberId: new ObjectId(memberId) },
            { 
                $set: { 
                    isCurrent: false 
                } 
            }
        );
  
        const resultUpdateCurrentProject = await projectRolesCollection.updateOne(
            { _id: new ObjectId(projectRoleId) },
            { $set: 
                { 
                    isCurrent: true
                }
            } 
        );
    
        return res.status(200).json({ message: "Project role is current status updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update Project role is current status' });
    }
}