import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { AppComponent } from "src/app/app.component";
import { Hunt } from "src/app/hunts/hunt";
import { HuntService } from "src/app/hunts/hunt.service";


@Injectable({
  providedIn: AppComponent
})
export class MockHuntService extends HuntService {
  static testHunts: Hunt[] = [
    {
      _id: 'hunt1_id',
      hostid: 'chris',
      title: 'Chris\'s Hunt',
      description: 'Chris\'s test hunt',
    },
    {
      _id: 'hunt2_id',
      hostid: 'pat',
      title: 'Pat\'s Hunt',
      description: 'Pat\'s test hunt',
    },
    {
      _id: 'hunt3_id',
      hostid: 'jamie',
      title: 'Jamie\'s Hunt',
      description: 'Jamie\'s test hunt',
    }
  ];

  constructor() {
    super(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getHunts(_filters: { hostid?: string }): Observable<Hunt[]> {
    return of(MockHuntService.testHunts);
  }

  // skipcq: JS-0105
  getHuntById(id: string): Observable<Hunt> {
    // If the specified ID is for one of the first two test users,
    // return that user, otherwise return `null` so
    // we can test illegal user requests.
    // If you need more, just add those in too.
    if (id === MockHuntService.testHunts[0]._id) {
      return of(MockHuntService.testHunts[0]);
    } else if (id === MockHuntService.testHunts[1]._id) {
      return of(MockHuntService.testHunts[1]);
    } else {
      return of(null);
    }
  }

  addHunt(huntDetails: Partial<Hunt>): Observable<string> {
    const newHunt: Hunt = {
      _id: `hunt${MockHuntService.testHunts.length + 1}_id`,
      hostid: huntDetails.hostid,
      title: huntDetails.title,
      description: huntDetails.description,
    };
    MockHuntService.testHunts.push(newHunt);

    return of(newHunt._id);
  }
}
