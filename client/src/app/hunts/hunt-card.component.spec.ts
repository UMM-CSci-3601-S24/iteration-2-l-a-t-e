import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HuntCardComponent } from './hunt-card.component';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Hunt } from './hunt';
import { HuntService } from './hunt.service';


describe('HuntCardComponent', () => {
  let component: HuntCardComponent;
  let fixture: ComponentFixture<HuntCardComponent>;
  let router: Router;
  let huntService: HuntService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HuntCardComponent, MatCardModule, BrowserAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: HuntService, useValue: jasmine.createSpyObj('HuntService', ['deleteHunt']) },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => '123'
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HuntCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    huntService = TestBed.inject(HuntService);
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HuntCardComponent);
    component = fixture.componentInstance;
    component.hunt = {
      _id: 'hunt1_id',
      hostid: 'chris',
      title: 'Chris\'s Hunt',
      description: 'Chris\'s test hunt',
      estimatedTime: 45
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stop event propagation when onPlayClick is called', () => {
    const event = new Event('click');
    spyOn(event, 'stopPropagation');

    component.onPlayClick(event);

    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should navigate to the hunt details page when onCardClick is called', () => {
    const navigateSpy = (router.navigate as jasmine.Spy);
    component.hunt = { _id: '123' } as Hunt;

    component.onCardClick();

    expect(navigateSpy).toHaveBeenCalledWith(['/hunts', '123']);
  });

  it('should delete the hunt and navigate to the hunts list page when onDeleteClick is called', () => {
    const event = new Event('click');
    const navigateSpy = (router.navigate as jasmine.Spy);
    const deleteHuntSpy = (huntService.deleteHunt as jasmine.Spy).and.returnValue(of(null));
    component.hunt = { _id: '123' } as Hunt;

    spyOn(window, 'confirm').and.returnValue(true);

    component.onDeleteClick(event);

    expect(deleteHuntSpy).toHaveBeenCalledWith('123');
    expect(navigateSpy).toHaveBeenCalledWith(['/hunts']);
  });

  it('should navigate to the hunt edit page when onEditClick is called', () => {
    const navigateSpy = (router.navigate as jasmine.Spy);
    component.hunt = { _id: '123' } as Hunt;

    component.onEditClick(new Event('click'));

    expect(navigateSpy).toHaveBeenCalledWith(['/hunts/edit', '123']);
  });

  it('should navigate to the hunt details page when onInspectClick is called', () => {
    const navigateSpy = (router.navigate as jasmine.Spy);
    component.hunt = { _id: '123' } as Hunt;

    component.onInspectClick(new Event('click'));

    expect(navigateSpy).toHaveBeenCalledWith(['/hunts', '123']);
  });
});
