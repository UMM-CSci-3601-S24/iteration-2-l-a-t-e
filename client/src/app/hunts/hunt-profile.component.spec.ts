import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError } from 'rxjs';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';

// import { Task } from './task';
import { TaskService } from './task.service';
import { MockHuntService } from 'src/testing/hunt.service.mock';

import { Hunt } from './hunt';
import { HuntCardComponent } from './hunt-card.component';
import { HuntService } from './hunt.service';
import { HuntProfileComponent } from './hunt-profile.component';
import { MockTaskService } from 'src/testing/task.service.mock';

describe('HuntProfileComponent', () => {
  let component: HuntProfileComponent;
  let fixture: ComponentFixture<HuntProfileComponent>;
  const mockHuntService = new MockHuntService();
  const mockTaskService = new MockTaskService();
  const patId = 'hunt2_id';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    // Using the constructor here lets us try that branch in `activated-route-stub.ts`
    // and then we can choose a new parameter map in the tests if we choose
    id: patId
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule,
        HuntProfileComponent, HuntCardComponent
      ],

      providers: [
        { provide: HuntService, useValue: mockHuntService },
        { provide: TaskService, useValue: mockTaskService },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HuntProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  //  it('should navigate to a specific hunt profile, load tasks', () => {
  //     const expectedHunt: Hunt = MockHuntService.testHunts[0];
  //     // Setting this should cause anyone subscribing to the paramMap
  //     // to update. Our `HuntProfileComponent` subscribes to that, so
  //     // it should update right away.
  //     activatedRoute.setParamMap({ id: expectedHunt._id });
  //     expect(component.hunt).toEqual(expectedHunt);
  //  });

  it('should navigate to correct hunt when the id parameter changes', fakeAsync(() => {
    let expectedHunt: Hunt = MockHuntService.testHunts[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `HuntProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedHunt._id });
    tick();
    fixture.detectChanges();
    expect(component.hunt).toEqual(expectedHunt);

    // Changing the paramMap should update the displayed hunt profile.
    expectedHunt = MockHuntService.testHunts[1];
    activatedRoute.setParamMap({ id: expectedHunt._id });
    tick();
    fixture.detectChanges();
    expect(component.hunt).toEqual(expectedHunt);
  }));

  it('should have `null` for the hunt for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });

    // If the given ID doesn't map to a hunt, we expect the service
    // to return `null`, so we would expect the component's hunt
    // to also be `null`.
    expect(component.hunt).toBeNull();
  });

  it('should set error data on observable error', () => {
    activatedRoute.setParamMap({ id: patId });

    const mockError = { message: 'Test Error', error: { title: 'Error Title' } };

    // const errorResponse = { status: 500, message: 'Server error' };
    // "Spy" on the `.addHunt()` method in the hunt service. Here we basically
    // intercept any calls to that method and return the error response
    // defined above.
    const getHuntSpy = spyOn(mockHuntService, 'getHuntById')
      .and
      .returnValue(throwError(() => mockError));

    component.ngOnInit();

    expect(component.error).toEqual({
      help: 'There was a problem loading the hunt - try again.',
      httpResponse: mockError.message,
      message: mockError.error.title,
    });
    expect(getHuntSpy).toHaveBeenCalledWith(patId);
  });
});
