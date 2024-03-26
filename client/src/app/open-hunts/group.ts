import { Hunter } from "./hunter";

export interface Group {
  _id: string;
  huntids: Array<string>;
  hunters: Array<Hunter>;
}
