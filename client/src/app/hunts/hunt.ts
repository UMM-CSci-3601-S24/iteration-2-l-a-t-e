import { Task } from "./task";

export interface Hunt {
    _id: string;
    hostid: string;
    title: string;
    description: string;
    tasks: Task[];
}
