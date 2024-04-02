import { DebugElement } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';

describe('Home', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MatCardModule, HomeComponent],
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
    expect(location.path()).toBe('/')
    flush();
  });
  }));

  it('showHunterInput changes flag', () =>{
  expect(component.showHunterInput).toBeFalse;
  component.showHunterForm();
  expect(component.showHunterInput).toBeTrue;
})

});
