import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HuntCardComponent } from './hunt-card.component';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HuntCardComponent', () => {
  let component: HuntCardComponent;
  let fixture: ComponentFixture<HuntCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HuntCardComponent,
        MatCardModule,
        BrowserAnimationsModule
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
