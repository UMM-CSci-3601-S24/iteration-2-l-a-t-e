import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { HuntListComponent } from '../hunts/hunt-list.component';
//import { HostComponent } from '../host/host.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let location: Location;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'hunt-list', component: HuntListComponent }
      ])]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sendToHost() should navigate to the right page', fakeAsync(() => {
    fixture.ngZone.run(() => {
    component.sendToHost();
    tick();
    expect(location.path()).toBe('/hunt-list')
    flush();
  });
  }));

});
