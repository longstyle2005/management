import clientPromise from "~/lib/mongodb/mongodb";
import { ObjectId } from "mongodb";

const readProjectListFullForViewer = async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("Management");
        const projectCollection = db.collection("projects");
        const roleCollection = db.collection("project_roles");
        const memberCollection = db.collection("members");

        const projects = await projectCollection.find().toArray();

        const projectsWithDetails = await Promise.all(
            projects.map(async (project) => {
                const projectId = project._id;
                const logo = project.logo;
                const name = project.name;
                const platforms = project.platforms;
                const situation = project.situation;
                const status = project.status;
                let controllerData = null;

                const projectRoleList = await roleCollection.find({ projectId }).toArray();
                const memberIdListInProject = projectRoleList.map(role => new ObjectId(role.memberId));

                const memberDataList = await memberCollection.find({ _id: { $in: memberIdListInProject } }).toArray();
                const numberOfmember = memberDataList.length;

                const mainControllerRole = projectRoleList.find((item) => {
                    return item.role === "mainController";
                });

                if (mainControllerRole) {
                    controllerData = memberDataList.find((item) => {
                        return item._id.toString() === mainControllerRole.memberId.toString();
                    });
                } 
                
                return {
                    projectId,
                    logo,
                    name,
                    platforms,
                    situation,
                    status,
                    controllerData,
                    numberOfmember,
                };
            })
        );

        return res.json(projectsWithDetails);
    } catch (error) {
        console.error('Error in API:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default readProjectListFullForViewer;
