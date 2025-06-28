import { ObjectId } from 'mongodb';
import clientPromise from "~/lib/mongodb/mongodb";

export default async function handler(req, res) {
	if (req.method !== 'DELETE') {
		return res.status(405).json({ message: 'Only DELETE method is allowed' });
	}

	const client = await clientPromise;
	const db = client.db('Management');
    const projectsCollection  = await db.collection('projects');
    const projectRolesCollection = await db.collection('project_roles');

	const { projectId } = req.query;
	
	try {
        if (!projectId || typeof projectId !== 'string') {
            return res.status(400).json({ message: 'Invalid projectId' });
        }

        const projectObjectId = new ObjectId(projectId);

		const deleteProjectResult = await projectsCollection.deleteOne({
			_id: projectObjectId,
		});

		const deleteRolesResult = await projectRolesCollection.deleteMany({
			projectId: projectObjectId,
		});

		return res.status(200).json({
			message: "Project and related roles deleted successfully",
			deletedProject: deleteProjectResult.deletedCount,
			deletedRoles: deleteRolesResult.deletedCount,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Failed to delete Project', error: error.message });
	}
}