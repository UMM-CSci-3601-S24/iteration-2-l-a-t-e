import { Hunter } from "./hunter";

export interface Group {
  _id: string;

  groupname: string;
  huntids: Array<string>;
  hunters: Array<Hunter>;
}
