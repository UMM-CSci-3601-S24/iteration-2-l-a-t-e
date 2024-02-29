import { Hunt } from "./hunt";

export interface HuntGroup {
  _id: string; // This will hold the hostid
  hunts: Hunt[];
  hostid: string;
}
