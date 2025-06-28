import { ObjectId } from 'mongodb';
import clientPromise from "~/lib/mongodb/mongodb";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const client = await clientPromise;
    const db = client.db('Management');
    const projectsCollection  = await db.collection('projects');
    const projectRolesCollection = await db.collection('project_roles');

    const { 
        projectId,
        logo,
        name,
        platforms,
        memberListInProject,
        report,
    } = req.body;  

    try {
        if (!projectId || typeof projectId !== 'string') {
            return res.status(400).json({ message: 'Invalid projectId' });
        }

        const projectObjectId = new ObjectId(projectId);

        const resultUpdatedProject = await projectsCollection.updateOne(
            { _id: projectObjectId },
            { $set: 
                { 
                    logo,
                    name,
                    platforms,
                    report,
                    updatedAt: new Date(),
                }
            } 
        );

        const existingRoles = await projectRolesCollection.find({ projectId: projectObjectId }).toArray();

        // Map
        const existingMap = new Map();
        existingRoles.forEach(role => {
            existingMap.set(role.memberId.toString(), role);
        });

        const incomingMap = new Map();
        memberListInProject.forEach(member => {
            incomingMap.set(member.memberId.toString(), member.role);
        });

        const bulkOps = [];

        // Update project_roles
        for (const { memberId, role } of memberListInProject) {
            const memberIdString = memberId.toString();
            const memberObjectId = new ObjectId(memberIdString);
    
            // Update
            const existing = existingMap.get(memberIdString);
            if (existing) {
                if (existing.role !== role) {
                    bulkOps.push({
                        updateOne: {
                            filter: { 
                                projectId: projectObjectId, 
                                memberId: memberObjectId 
                            },
                            update: { $set: { role } }
                        }
                    });
                }
            }
            // Add new
            else {
                bulkOps.push({
                    insertOne: {
                        document: {
                            projectId: projectObjectId,
                            memberId: memberObjectId,
                            role,
                            status: '0',
                            isCurrent: false,
                        }
                    }
                });
            }
        }
  
        // Delete member is no longer in the new list
        for (const { memberId } of existingRoles) {
            const memberIdString = memberId.toString();
            if (!incomingMap.has(memberIdString)) {
                bulkOps.push({
                    deleteOne: {
                        filter: {
                            projectId: projectObjectId,
                            memberId: new ObjectId(memberIdString)
                        }
                    }
                });
            }
        }
    
        if (bulkOps.length > 0) {
            await projectRolesCollection.bulkWrite(bulkOps);
        }
    
        return res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update Project' });
    }
}