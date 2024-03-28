import { Group } from "./group";

export interface OpenHunt {
  _id: string;
  active: boolean;
  hostid: string;
  huntid: string;
  title: string;
  description: string;
  invitecode: string;
  numberofgroups: number;
  groupids: Array<string>
  groups: Array<Group>

}
