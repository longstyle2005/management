import { ObjectId } from 'mongodb';
import clientPromise from "~/lib/mongodb/mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db('Management');
    const projectsCollection  = await db.collection('projects');
    const projectRolesCollection = await db.collection('project_roles');

    if (req.method === 'POST') {
        const { 
            logo,
            name,
            platforms,
            situation,
            status,
            memberListInProject,
            report,
        } = req.body;  

        try {
            const newProject = {
                logo,
                name,
                platforms,
                situation,
                status,
                report,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const projectResult = await projectsCollection.insertOne(newProject);
            const projectId = projectResult.insertedId;
    
            // Add to project_roles
            const roleMap = new Map();
            memberListInProject.forEach((member) => {
                if (ObjectId.isValid(member.memberId)) {roleMap.set(member, 
                    {
                        projectId,
                        memberId: new ObjectId(member.memberId),
                        role: member.role,
                        status: '0',
                        isCurrent: false,
                    });
                }
            });

            const roleDocs = Array.from(roleMap.values());
            await projectRolesCollection.insertMany(roleDocs);
           
            return res.status(200).json({ message: "Project created successfully!" });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to create Project' });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}