import clientPromise from "~/lib/mongodb/mongodb";
import { ObjectId } from 'mongodb';

const readMemberById =  async (req, res) => {
    const { id } = req.query;
    try {
        const client = await clientPromise;
        const db = client.db("Management");
        const memberData = await db
            .collection("members")
            .findOne({ _id: new ObjectId(id) });
        if (!memberData) {
            return res.status(404).json({ message: 'Member not found' });
        }
        return res.json(memberData);
    } catch (error) {
        console.error('Error in API:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default readMemberById;