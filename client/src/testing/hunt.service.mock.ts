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
}
