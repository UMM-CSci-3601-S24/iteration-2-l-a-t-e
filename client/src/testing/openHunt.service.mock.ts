import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { AppComponent } from "src/app/app.component";
import { OpenHunt } from "src/app/open-hunts/openHunt";
// import { Group } from "src/app/open-hunts/group";
// import { Hunter } from "src/app/open-hunts/hunter";
import { OpenHuntService } from "src/app/open-hunts/openHunt.service";

@Injectable({
  providedIn: AppComponent
})
export class MockOpenHuntService extends OpenHuntService {

  static testOpenHunts: OpenHunt[] = [
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
      groups: [
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
        }
      ]
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
      groups: [
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
        }
      ]
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
      groups: [
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
    }
  ];

  constructor() {
    super(null);
  }

  getOpenHuntById(id: string): Observable<OpenHunt> {
    // If the specified ID is for one of the first two test users,
    // return that user, otherwise return `null` so
    // we can test illegal user requests.
    // If you need more, just add those in too.
    if (id === MockOpenHuntService.testOpenHunts[0]._id) {
      return of(MockOpenHuntService.testOpenHunts[0]);
    // } else if (id === MockOpenHuntService.testOpenHunts[1]._id) {
    //   return of(MockOpenHuntService.testOpenHunts[1]);
    // }  else if (id === MockOpenHuntService.testOpenHunts[2]._id) {
    //   return of(MockOpenHuntService.testOpenHunts[2]);
    } else {
      return of(null);
    }
  }


}
