import clientPromise from "~/lib/mongodb/mongodb";
import { ObjectId } from 'mongodb';

const readProjectById = async (req, res) => {
    const { id } = req.query;
    try {
        const client = await clientPromise;
        const db = client.db("Management");
        const projectCollection = db.collection("projects");
        const roleCollection = db.collection("project_roles");
        const memberCollection = db.collection("members");
        const projectId = new ObjectId(id);

        const project = await projectCollection.findOne({ _id: projectId });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const logo = project.logo;
        const name = project.name;
        const platforms = project.platforms;
        const situation = project.situation;
        const status = project.status;
        const report = project.report;

        const memberListAll = await memberCollection.find({ role: { $ne: "admin" } }, { projection: { _id: 1, nickname: 1 } }).toArray();
        const memberListAllConvertedId = memberListAll.map(member => ({
            projectId: projectId,
            memberId: member._id.toString(),
            nickname: member.nickname,
            status: '0',
            role: 'member'
        }));
        const projectRoleList = await roleCollection.find({ projectId }).toArray();
        const memberListInProject = projectRoleList.map(role => {
            return {
                projectId: projectId,
                memberId: role.memberId.toString(),
                role: role.role,
                status: role.status,        
            };
        });

        const nicknameMap = new Map(
            memberListAllConvertedId.map(member => [member.memberId, member.nickname])
        );
        const memberListInProjectFinal = memberListInProject.map(item => ({
            ...item,
            nickname: nicknameMap.get(item.memberId) || null
        }));

        const mainController = projectRoleList.find(member => member.role === 'mainController');
        const backendController = projectRoleList.find(member => member.role === 'backendController');
        const frontendController = projectRoleList.find(member => member.role === 'frontendController');

        const mainControllerId = mainController ? mainController.memberId : '';
        const backendControllerId = backendController ? backendController.memberId : '';
        const frontendControllerId = frontendController ? frontendController.memberId : '';

        return res.json({
            projectId,
            logo,
            name,
            platforms,
            situation,
            status,
            memberListAllConvertedId,
            memberListInProjectFinal,
            mainControllerId,
            backendControllerId,
            frontendControllerId,
            report,
        });
    } catch (error) {
        console.error('Error in API:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default readProjectById;