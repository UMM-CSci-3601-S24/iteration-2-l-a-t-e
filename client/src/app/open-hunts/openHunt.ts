
export interface OpenHunt {
  _id: string;
  invitecode: string;
  active: boolean;
  numberofgroups: number;
  groupids: Array<string>
  // Todo: Possibly put a reference here to the actual hunt it is an instance of
}
