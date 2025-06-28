import clientPromise from "~/lib/mongodb/mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db('Management');
    const dbMember = await db.collection('members');

    if (req.method === 'POST') {
        const { 
            avatar,
            nickname,
            email,
            team,
            position,
            off,
            role,
        } = req.body;    
        try {
            // Check nick name exists.
            const existingMember = await dbMember.findOne({ nickname });
            if (existingMember) {
                return res.status(400).json({ message: 'Nickname already exists' });
            }
            const resultCreateMember = await dbMember.insertOne({ 
                avatar,
                nickname,
                email,
                team,
                position,
                off,
                role,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return res.status(201).json({ message: 'Member created successfully'});
        } catch (error) {
            return res.status(500).json({ error: 'Failed to create Member' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' }); // Just POST
    }
}