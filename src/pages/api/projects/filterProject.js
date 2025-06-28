import clientPromise from "~/lib/mongodb/mongodb";
import { ObjectId } from "mongodb";

const readProjectList = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const client = await clientPromise;
    const db = client.db("Management");
    const projectCollection = db.collection("projects");
    const roleCollection = db.collection("project_roles");
    const memberCollection = db.collection("members");

    const { 
        name,
        situationId,
    } = req.query;

    const queryFilter = {}

    try {

        if (name && typeof name === 'string') {
            queryFilter.name = { $regex: name, $options: 'i' };
        }

        if (situationId && typeof situationId === 'string') {
            queryFilter.situation = situationId;
        }

        const projects = await projectCollection.find(queryFilter).toArray();

        const projectsWithDetails = await Promise.all(
            projects.map(async (project) => {
                const projectId = project._id;
                const logo = project.logo;
                const name = project.name;
                const platforms = project.platforms;
                const situation = project.situation;
                const status = project.status;

                const projectRoleList = await roleCollection.find({ projectId }).toArray();
                const memberIdList = projectRoleList.map(role => new ObjectId(role.memberId));

                const memberDataList = await memberCollection.find({ _id: { $in: memberIdList } }).toArray();
                const memberMap = new Map(memberDataList.map(member => [member._id.toString(), member]));

                const rolesWithMemberInfo = projectRoleList.map(role => {
                    const memberInfo = memberMap.get(role.memberId.toString());
                    return {
                        _id: role._id,
                        role: role.role,
                        status: role.status,        
                        memberId: role.memberId,
                        member: memberInfo || null,
                    };
                });

                return {
                    projectId,
                    logo,
                    name,
                    platforms,
                    situation,
                    status,
                    rolesWithMemberInfo,
                };
            })
        );

        return res.json(projectsWithDetails);
    } catch (error) {
        console.error('Error in API:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default readProjectList;
