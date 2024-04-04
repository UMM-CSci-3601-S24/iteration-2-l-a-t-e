import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { AppComponent } from "src/app/app.component";
import { Lobby, LobbyService, Group, Hunter } from "src/app/hunts/lobby.service";

@Injectable({
  providedIn: AppComponent
})

export class MockLobbyService extends LobbyService {


  static testOpenHunts: Lobby[] = [
    {
      _id: 'hunt1_id',
      active: true,
      hostid: 'chris',
      huntid: 'hunt1',
      title: 'Chris\'s Hunt',
      description: 'Chris\'s test hunt',
      invitecode: '1234',
      numberofgroups: 1,
      groupids: ['group1'],
    },
    {
      _id: 'hunt2_id',
      active: true,
      hostid: 'pat',
      huntid: 'hunt2',
      title: 'Pat\'s Hunt',
      description: 'Pat\'s test hunt',
      invitecode: '4321',
      numberofgroups: 1,
      groupids: ['group2'],
    },
    {
      _id: 'hunt3_id',
      active: true,
      hostid: 'jamie',
      huntid: 'hunt3',
      title: 'Jamie\'s Hunt',
      description: 'Jamie\'s test hunt',
      invitecode: '7363',
      numberofgroups: 1,
      groupids: ['group3'],
    }
  ];

  static testGroups: Group[] = [
    {
      _id: 'group1',
      groupName: 'Group1',
      hunterIds: ['hunter1'],
      hunters: [
        {
          _id: 'hunter1',
          hunterName: 'Hunter1'
        }
      ]
    },
    {
      _id: 'group2',
      groupName: 'Group2',
      hunterIds: ['hunter2'],
      hunters: [
        {
          _id: 'hunter2',
          hunterName: 'Hunter2'
        }
      ]
    },
    {
      _id: 'group3',
      groupName: 'Group3',
      hunterIds: ['hunter3'],
      hunters: [
        {
          _id: 'hunter3',
          hunterName: 'Hunter3'
        }
      ]
    }
  ]

  static testHunters: Hunter[] = []


  constructor() {
    super(null);
  }

  // searchByInviteCode(code: string): Observable<Lobby> {
  //   if (code === MockLobbyService.testOpenHunts[0]._id) {
  //     return of(MockLobbyService.testOpenHunts[0]);
  //   } else if (code === MockLobbyService.testOpenHunts[1]._id) {
  //     return of(MockLobbyService.testOpenHunts[1]);
  //   } else {
  //     return of(null);
  //   }
  // }

  // getGroupById(id: string): Observable<Group> {
  //   if (id === MockLobbyService.testGroups[0]._id) {
  //     return of(MockLobbyService.testGroups[0]);
  //   } else if (id === MockLobbyService.testGroups[1]._id) {
  //     return of(MockLobbyService.testGroups[1]);
  //   } else {
  //     return of(null);
  //   }
  // }

  // getOpenHuntById(id: string): Observable<Lobby> {
  //   if (id === MockLobbyService.testOpenHunts[0]._id) {
  //     return of(MockLobbyService.testOpenHunts[0]);
  //   } else if (id === MockLobbyService.testOpenHunts[1]._id) {
  //     return of(MockLobbyService.testOpenHunts[1]);
  //   } else {
  //     return of(null);
  //   }
  // }

  // addNewOpenHunt(newOpenHuntDetails: Partial<Lobby>): Observable<string> {
  //   let idList: string[];
  //   for(let i = 1; i<= newOpenHuntDetails.numberofgroups; i++){
  //   const newGroup: Group = {
  //     _id: `group${MockLobbyService.testGroups.length + 1}_id`,
  //     groupName: `Group${i}`,
  //     hunterIds: [],
  //     hunters: []
  //   }
  //   idList.push(newGroup._id)
  // }
  //   const newOpenHunt: Lobby = {
  //     _id: `hunt${MockLobbyService.testOpenHunts.length + 1}_id`,
  //     active: newOpenHuntDetails.active,
  //     hostid: newOpenHuntDetails.hostid,
  //     huntid: newOpenHuntDetails.huntid,
  //     title: newOpenHuntDetails.title,
  //     description: newOpenHuntDetails.description,
  //     invitecode: newOpenHuntDetails.invitecode,
  //     numberofgroups: newOpenHuntDetails.numberofgroups,
  //     groupids: idList
  //   };
  //   MockLobbyService.testOpenHunts.push(newOpenHunt);

  //   return of(newOpenHunt._id);
  // }

  // addNewHunterByOpenHuntId(openHuntId: string, hunterData: Partial<Hunter>): Observable<string> {
  //   const newHunter: Hunter = {
  //     _id: `hunter${MockLobbyService.testHunters.length +1}_id`,
  //     hunterName: hunterData.hunterName
  //   }
  //   MockLobbyService.testGroups[0].hunterIds.push(newHunter._id);
  //   return of(MockLobbyService.testGroups[0]._id)
  // }

  }


