import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HuntCardComponent } from './hunt-card.component';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('HuntCardComponent', () => {
  let component: HuntCardComponent;
  let fixture: ComponentFixture<HuntCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HuntCardComponent],
      imports: [
        HuntCardComponent,
        MatCardModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {paramMap: of({ get: () => '123' }) } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HuntCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HuntCardComponent);
    component = fixture.componentInstance;
    component.hunt = {
      _id: 'hunt1_id',
      hostid: 'chris',
      title: 'Chris\'s Hunt',
      description: 'Chris\'s test hunt'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
