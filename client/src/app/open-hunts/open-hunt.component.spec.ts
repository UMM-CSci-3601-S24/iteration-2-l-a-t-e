import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
// import { throwError } from 'rxjs';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';


import { MockOpenHuntService } from 'src/testing/openHunt.service.mock';
import { OpenHuntService } from './openHunt.service';
import { OpenHuntComponent } from './open-hunt.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OpenHuntComponent', () => {
  let component: OpenHuntComponent;
  let fixture: ComponentFixture<OpenHuntComponent>;
  const mockOpenHuntService = new MockOpenHuntService();
  const chrisId = 'hunt1_id';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    // Using the constructor here lets us try that branch in `activated-route-stub.ts`
    // and then we can choose a new parameter map in the tests if we choose
    id: chrisId
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule,
        OpenHuntComponent,
        HttpClientTestingModule
      ],

      providers: [
        { provide: OpenHuntService, useValue: mockOpenHuntService },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenHuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have `null` for the hunt for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });

    // If the given ID doesn't map to a hunt, we expect the service
    // to return `null`, so we would expect the component's hunt
    // to also be `null`.
    expect(component.openHunt).toBeNull();
  });

}
)
