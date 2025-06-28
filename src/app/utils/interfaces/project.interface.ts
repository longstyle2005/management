import { ObjectId } from "mongodb";
export interface Project {
    logo: string;
    name: string;
    platforms: string[];
    situation: string;
    status: string;
    memberIdList: [];
    mainControllerId: ObjectId | string;
    backendControllerId: ObjectId | string;
    frontendControllerId: ObjectId | string;
}