import { ObjectId } from 'mongodb';
import clientPromise from "~/lib/mongodb/mongodb";

export default async function handler(req, res) {
	if (req.method !== 'DELETE') {
		return res.status(405).json({ message: 'Only DELETE method is allowed' });
	}

	const client = await clientPromise;
	const db = client.db('Management');
	const membersCollection  = await db.collection('members');
	const projectRolesCollection = await db.collection('project_roles');
	const { memberId } = req.query;

	try {
        if (!memberId  || typeof memberId  !== 'string') {
            return res.status(400).json({ message: 'Invalid memberId' });
        }

		const memberObjectId = new ObjectId(memberId);

		const deleteMemberResult = await membersCollection.deleteOne({ 
			_id: memberObjectId 
		});

		const deleteRolesResult = await projectRolesCollection.deleteMany({
			memberId: memberObjectId,
		});

		return res.status(200).json({
			message: "Member and related roles deleted successfully",
			deleteMemberResult: deleteMemberResult.deletedCount,
			deleteRolesResult: deleteRolesResult.deletedCount,
		});

	} catch (error) {
		return res.status(500).json({ message: 'Failed to delete Member', error: error.message });
	}
}