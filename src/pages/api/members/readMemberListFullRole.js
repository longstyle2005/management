import clientPromise from "~/lib/mongodb/mongodb";

const readMemberListFullRole =  async (req, res) => {
        try {
            const client = await clientPromise;
            const db = client.db("Management");
            const memberCollection = db.collection("members");
            const projectCollection = db.collection("projects");
            const roleCollection = db.collection("project_roles");
    
            const members = await memberCollection.find({ role: { $ne: "admin" } }).toArray();
    
            const membersWithDetails = await Promise.all(
                members.map(async (member) => {
                    const memberId = member._id;
                    const avatar = member.avatar;
                    const nickname = member.nickname;
                    const email = member.email;
                    const team = member.team;
                    const position = member.position;
                    const role = member.role;
                    const off = member.off;
    
                    const projectRoleList = await roleCollection.find({ memberId }).toArray();
                    const projectIdList = projectRoleList.map(role => role.projectId);

                    const projectDataList = await projectCollection.find({ _id: { $in: projectIdList } }).toArray();
                    const projectMap = new Map(projectDataList.map(project => [project._id.toString(), project]));
    
                    const rolesWithProjectInfo = projectRoleList.map(role => {
                        const projectInfo = projectMap.get(role.projectId.toString());
                        return {
                            _id: role._id,
                            role: role.role,
                            status: role.status,        
                            projectId: role.projectId,
                            project: projectInfo || null,
                            isCurrent: role.isCurrent,
                        };
                    });
    
                    return {
                        memberId,
                        avatar,
                        nickname,
                        email,
                        team,
                        position,
                        role,
                        off,
                        rolesWithProjectInfo,
                    };
                })
            );
    
            return res.json(membersWithDetails);
        } catch (error) {
            console.error('Error in API:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
}

export default readMemberListFullRole;