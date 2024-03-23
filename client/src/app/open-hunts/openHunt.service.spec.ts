import { OpenHunt } from "./openHunt"
import { OpenHuntService } from "./openHunt.service";


describe('OpenHuntSevice', () => {
  const testOpenHunts: OpenHunt[] = [
    {
      _id: 'hunt1_id',
      invitecode: 'hunt1',
      active: true,
      numberofgroups: 1,
      groupids: ["group1"]
    },
    {
      _id: 'hunt2_id',
      invitecode: 'hunt2',
      active: true,
      numberofgroups: 2,
      groupids: ["group1","group2"]
    },
    {
      _id: 'hunt3_id',
      invitecode: 'hunt3',
      active: true,
      numberofgroups: 3,
      groupids: ["group1","group2","group3"]
    },
    {
      _id: 'hunt4_id',
      invitecode: 'hunt4',
      active: false,
      numberofgroups: 4,
      groupids: ["group1","group2","group3","group4"]
    }
  ];

  let openHuntService: OpenHuntService;

})
