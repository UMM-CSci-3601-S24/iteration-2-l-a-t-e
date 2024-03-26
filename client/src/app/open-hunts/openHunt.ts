
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

  // Todo: Possibly put a reference here to the actual hunt it is an instance of
}
