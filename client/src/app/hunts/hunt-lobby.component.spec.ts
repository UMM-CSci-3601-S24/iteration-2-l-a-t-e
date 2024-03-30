import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HuntLobbyComponent } from './hunt-lobby.component';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

// Mock class for LobbyService
class MockLobbyService {
  getLobbyByInviteCode() {
    return of({
      title: 'Test Lobby',
      description: 'A test lobby description',
      tasks: [{ id: '1', title: 'Test Task', description: 'Test Task Description' }],
      teammates: [{ id: '1', name: 'Test Teammate' }]
    });
  }
}

describe('HuntLobbyComponent', () => {
  let component: HuntLobbyComponent;
  let fixture: ComponentFixture<HuntLobbyComponent>;
  let mockLobbyService: MockLobbyService;

  beforeEach(async () => {
    mockLobbyService = new MockLobbyService();

    await TestBed.configureTestingModule({
      declarations: [ HuntLobbyComponent ],
      imports: [ FormsModule ],
      providers: [ { useValue: mockLobbyService } ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HuntLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getLobbyByInviteCode and render lobby details', () => {
    const spy = spyOn(mockLobbyService, 'getLobbyByInviteCode').and.callThrough();
    component.inviteCode = 'testCode';

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith();
    expect(component.lobby).toBeTruthy();
    expect(fixture.nativeElement.querySelector('h3').textContent).toContain('Test Lobby');
  });

  it('should display an error message when invite code is not provided', () => {
     // Don't set inviteCode to simulate error
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Please enter a valid invite code.');
    expect(fixture.nativeElement.querySelector('.error-message').textContent).toContain('Please enter a valid invite code.');
  });

  it('should handle errors from LobbyService gracefully', () => {
    spyOn(mockLobbyService, 'getLobbyByInviteCode').and.returnValue(throwError(() => new Error('An error occurred')));
    component.inviteCode = 'testCode';

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Failed to fetch lobby details or Lobby not found.');
    expect(fixture.nativeElement.querySelector('.error-message').textContent).toContain('Failed to fetch lobby details or Lobby not found.');
  });
});
