import { ObjectId } from 'mongodb';
import clientPromise from "~/lib/mongodb/mongodb";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const client = await clientPromise;
    const db = client.db('Management');
    const membersCollection = db.collection('members');
    const projectCollection = db.collection("projects");
    const roleCollection = db.collection("project_roles");

    const { 
        nickname,
        teamId,
    } = req.query;

    const queryFilter = { role: { $ne: "admin" } };

    try {

        if (nickname && typeof nickname === 'string') {
            queryFilter.nickname = { $regex: nickname, $options: 'i' };
        }

        if (teamId && typeof teamId === 'string') {
            queryFilter.team = teamId;
        }

        const members = await membersCollection.find(queryFilter).toArray();

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
        console.error('Search members error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}