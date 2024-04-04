import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HuntLobbyComponent } from './hunt-lobby.component';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

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
      imports: [ FormsModule, HuntLobbyComponent, HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'hunt-lobby', component: HuntLobbyComponent }
        ]),
      ],
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

  it('should display an error message when invite code is not provided', async () => {
    // Simulate the condition that should display the error message.
    // For example, if it's based on a form submission, simulate that action here.

    await fixture.whenStable(); // Wait for async operations to complete

    fixture.detectChanges(); // Apply any changes resulting from async operations

    const errorElement = component.errorMessage;
    expect(errorElement).toBeTruthy('The error message element should exist.');

    // Proceed with your assertions only if errorElement is not null
    if (errorElement) {
      expect(errorElement).toContain('Please enter a valid invite code.');
    }
  });

  it('should handle errors from LobbyService gracefully', () => {
    spyOn(mockLobbyService, 'getLobbyByInviteCode').and.returnValue(throwError(() => new Error('An error occurred')));
    component.inviteCode = '1234';

    fixture.whenStable().then(() => {
      fixture.detectChanges();
    expect(component.errorMessage).toBe('Please enter a valid invite code.');
    });
  });

  it('should initialize with default tab selected', () => {
    expect(component.selectedTab).toEqual('tasks'); // Assuming 'tasks' is the default
  });

});
