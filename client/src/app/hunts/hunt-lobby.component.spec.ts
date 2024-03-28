import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuntLobbyComponent } from './hunt-lobby.component';

describe('HuntLobbyComponent', () => {
  let component: HuntLobbyComponent;
  let fixture: ComponentFixture<HuntLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HuntLobbyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HuntLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
