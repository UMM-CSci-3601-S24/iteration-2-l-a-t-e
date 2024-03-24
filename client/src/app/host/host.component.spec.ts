import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockTaskService } from 'src/testing/task.service.mock';
import { MockHuntService } from 'src/testing/hunt.service.mock';
import { Hunt } from '../hunt/hunt';
import { TaskService } from '../hunt/task.service';
import { HuntService } from '../hunt/hunt.service';
// import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { ActivatedRoute } from '@angular/router';
import { HostComponent } from './host.component';
import { fakeAsync, flush, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { CreateHuntComponent } from '../create-hunt/create-hunt.component';
import { EditHuntComponent } from '../hunt/edit-hunt.component';





const COMMON_IMPORTS: unknown[] = [
 FormsModule,
 MatCardModule,
 MatFormFieldModule,
 MatSelectModule,
 MatOptionModule,
 MatButtonModule,
 MatInputModule,
 MatExpansionModule,
 MatTooltipModule,
 MatListModule,
 MatDividerModule,
 MatRadioModule,
 MatIconModule,
 MatSnackBarModule,
 BrowserAnimationsModule,
 RouterTestingModule,
];


describe('HostComponent', () => {
 let hostComponent: HostComponent;
 let fixture: ComponentFixture<HostComponent>;


 beforeEach(waitForAsync( () => {
   TestBed.configureTestingModule({
     imports: [COMMON_IMPORTS, HostComponent],
     providers: [{ provide: TaskService, useValue: new MockTaskService() },
       {provide: HuntService, useValue: new MockHuntService()}]


   })
   .compileComponents();
 }));


 beforeEach(() => {
   fixture = TestBed.createComponent(HostComponent);
   hostComponent = fixture.componentInstance;
   fixture.detectChanges();
 });


 it('contains all the hunts', () => {
   expect(hostComponent.serverFilteredHunts.length).toBe(3);
 });

it('can search for all hunts with Id', () => {
  const id1 = hostComponent.serverFilteredHunts[0]._id
  hostComponent.seeHuntDetails(id1)
  expect(hostComponent.huntChosen).toBe(hostComponent.serverFilteredHunts[0])

  const id2 = hostComponent.serverFilteredHunts[1]._id
  hostComponent.seeHuntDetails(id2)
  expect(hostComponent.huntChosen).toBe(hostComponent.serverFilteredHunts[1])

  const id3 = hostComponent.serverFilteredHunts[2]._id
  hostComponent.seeHuntDetails(id3)
  expect(hostComponent.huntChosen).toBe(hostComponent.serverFilteredHunts[2])
})

});

describe('MockHuntService', () => {
  let service: MockHuntService;

  beforeEach(() => {
    service = new MockHuntService();
  });

  it('should return the correct hunt when the id matches', () => {
    const id = MockHuntService.testHunts[0]._id;
    const id2 = MockHuntService.testHunts[1]._id;
    const id3 = MockHuntService.testHunts[2]._id;

    const expectedHunt = MockHuntService.testHunts[0];
    const expectedHunt2 = MockHuntService.testHunts[1]; // Assign a value to expectedHunt2

    service.getHuntById(id).subscribe((hunt: Hunt) => {
      expect(hunt).toEqual(expectedHunt);
    });

    service.getHuntById(id2).subscribe((hunt: Hunt) => { // Use expectedHunt2 in an assertion statement
      expect(hunt).toEqual(expectedHunt2);
    });

    service.getHuntById(id3).subscribe((hunt: Hunt) => {
      expect(hunt).toEqual(MockHuntService.testHunts[2]);
    });

  });

  it('should return the default hunt when the id does not match', () => {
    const id = 'invalid-id';
    const expectedHunt = MockHuntService.testHunts[0];

    service.getHuntById(id).subscribe((hunt: Hunt) => {
      expect(hunt).toEqual(expectedHunt);
    });
  });
});

describe('generates an error if we don\'t set up a HuntService', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>

  let huntServiceStub: {
    getHunts: () => Observable<Hunt[]>;
  };

  beforeEach(() => {
    huntServiceStub = {
      getHunts: () => new Observable(observer => {
        observer.error('getHunts() Observer generates an error');
      }),
    };
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, HostComponent],
      providers: [{ provide: HuntService, useValue: huntServiceStub }]
    })
  });

  beforeEach(waitForAsync(() => {
    // Compile all the components in the test bed
    // so that everything's ready to go.
    TestBed.compileComponents().then(() => {

      fixture = TestBed.createComponent(HostComponent);
      hostComponent = fixture.componentInstance;

      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a UserListService', () => {

    expect(hostComponent.serverFilteredHunts)
      .withContext('service can\'t give values to the list if it\'s not there')
      .toBeUndefined();

    expect(hostComponent.errMsg)
      .withContext('the error message will be')
      .toContain('Problem contacting the server – Error Code:');
  })
})

describe('navigation', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let location: Location;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'hunt/new', component: CreateHuntComponent },
          { path: 'task/testHuntId', component: EditHuntComponent }
      ])]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigateToCreateHunt() should navigate to the right page', fakeAsync(() => {
    fixture.ngZone.run(() => {
    component.navigateToCreateHunt();
    tick();
    expect(location.path()).toBe('/hunt/new')
    flush();
  });
  }));

  it('navigateToCreateHunt() should navigate to the right page', fakeAsync(() => {
    fixture.ngZone.run(() => {
    // component.HuntId = 'testHuntId'
    component.navigateToCreateTask('testHuntId');
    tick();
    expect(location.path()).toBe('/task/testHuntId')
    flush();
  });
  }));

});
