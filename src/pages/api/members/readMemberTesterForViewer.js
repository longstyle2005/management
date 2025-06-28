import clientPromise from "~/lib/mongodb/mongodb";

const readMemberTesterForViewer = async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("Management");
        const roleCollection = db.collection("project_roles");
        const memberCollection = db.collection("members");

        const members = await memberCollection.find({
            role: { $ne: "admin" },
            team: "team_03", 
        }).toArray();

        const memberDetailList = await Promise.all(
            members.map(async (member) => {
                const memberId = member._id;
                const off = member.off;

                const projectRoleList = await roleCollection.find({ memberId }).toArray();

                const projectRoleStatus = projectRoleList.find((item) => {
                    return item.isCurrent === true;
                });

                return {
                    off,
                    status: projectRoleStatus && projectRoleStatus.status ? projectRoleStatus.status : '0',
                };
            })
        );

        return res.json(memberDetailList);
    } catch (error) {
        console.error('Error in API:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default readMemberTesterForViewer;
