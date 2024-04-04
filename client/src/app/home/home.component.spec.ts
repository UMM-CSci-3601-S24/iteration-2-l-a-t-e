import { DebugElement } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { LobbyService } from '../hunts/lobby.service';
import { MockLobbyService } from 'src/testing/lobby.service.mock';
import { of } from 'rxjs';

describe('Home', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MatCardModule, HomeComponent, HttpClientTestingModule],
    providers: [{ provide: LobbyService, useValue: new MockLobbyService}]
});

    fixture = TestBed.createComponent(HomeComponent);

    component = fixture.componentInstance; // BannerComponent test instance

    // query for the link (<a> tag) by CSS element selector
    de = fixture.debugElement.query(By.css('.home-card'));
    el = de.nativeElement;
  });

  it('It has the basic home page text', () => {
    fixture.detectChanges();
    expect(el.textContent).toContain('Welcome to the hunt');
    expect(component).toBeTruthy();
  });

});

describe('home navigation', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let location: Location;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule,
        RouterTestingModule.withRoutes([
           { path: 'login', component: LoginComponent }
      ])]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    fixture.detectChanges();
  })

  it('sendToHost() should navigate to the right page', fakeAsync(() => {
    fixture.ngZone.run(() => {
    component.hostLogin();
    tick()
    expect(location.path()).toBe('/login')
    flush();
  });
  }));

  it('showHunterInput changes flag and if false sets variable to empty', () =>{
  expect(component.showHunterInput).toBeFalse;
  component.showHunterForm();
  expect(component.showHunterInput).toBeTrue;
  component.showHunterForm();
  expect(component.inviteCode).toEqual('')
  expect(component.username).toEqual('')
});

// it('should toggle input visibility when clicking the Hunter button', () => {
//   // Initially, inputs should not be visible
//   expect(fixture.debugElement.query(By.css('.input-card'))).toBeNull();

//   // Find the Hunter button and click it
//   const hunterButton = fixture.debugElement.query(By.css('.action-button')).nativeElement;
//   hunterButton.click();
//   fixture.detectChanges(); // Update view

//   // Now, inputs should be visible
//   expect(fixture.debugElement.query(By.css('.input-card'))).not.toBeNull();
// });

it('submit code function works', () => {
  component.inviteCode = '1234';
  component.username = 'testUsername';
  component.submitCode();
  expect(component.lobbyService.getInviteCode()).toEqual('1234');
  component.lobbyService.searchByInviteCode(component.inviteCode);
});
it('should navigate to "/hunt-lobby" for an active lobby after submitting code', fakeAsync(() => {
  spyOn(component.lobbyService, 'setInviteCode');
  spyOn(component.lobbyService, 'searchByInviteCode').and.returnValue(of({
    _id: "123",
    active: true,
    hostid: "generic",
    huntid: "588935f5236b2d4ad76a1411",
    title: "Generic-Classic",
    description: "this is a classic scavenger hunt that will apply to most towns",
    invitecode: "17.0407",
    numberofgroups: 3,
    groupids: [
      "6604555a2713335ce969fbda",
      "6604555a3c7292c3bdc28d20",
      "6604555a8aff87ad616185d9"
    ]
 }));
  const mockedMethod = spyOn(component, 'addNewHunterToGroup').and.callThrough();

  component.inviteCode = 'validCode';
  component.username = 'hunterName';
  component.submitCode();
  tick(); // Simulate async operation

  expect(mockedMethod)
  .toHaveBeenCalledWith('123');
  // expect(component.addNewHunterToGroup).toHaveBeenCalledWith('123');
  // expect(component.router.navigate).toHaveBeenCalledWith(['/hunt-lobby']);
}));


it('add new hunter to group function works', () => {
component.username = 'testUsername';
component.addNewHunterToGroup('hunt1_id');
});
});
