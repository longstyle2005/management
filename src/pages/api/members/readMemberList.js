import clientPromise from "~/lib/mongodb/mongodb";

const readMemberList =  async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("Management");
        const memberData = await db
            .collection("members")
            .find({ role: { $ne: "admin" } })
            .toArray();
        res.json(memberData);
    } catch (error) {
        console.error('Error in API:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default readMemberList;