import clientPromise from "~/lib/mongodb/mongodb";

export default async function handler(req, res) {
    const { email } = req.query;

    const client = await clientPromise;
    const db = client.db("Management");

    const member = await db.collection("members").findOne({ email });

    if (!member || !member.avatar) {
     	return res.status(404).send("Avatar not found");
    }

    const base64Data = member.avatar.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    res.setHeader("Content-Type", "image/jpeg");
    res.send(buffer);
}