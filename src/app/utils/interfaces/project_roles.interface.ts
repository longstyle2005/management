import { ObjectId } from "mongodb";
export interface ProjectRoles {
    memberId: ObjectId[] | string[];
    projectId: ObjectId[] | string[];
    role: string;
    status: string;
}