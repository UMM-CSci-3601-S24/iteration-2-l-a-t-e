import { Hunter } from "./hunter";

export interface Group {
  _id: string;

  groupName: string;
  hunterIds: Array<string>;
  hunters: Array<Hunter>;
}
