import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LobbyService } from './lobby.service';
import { environment } from '../../environments/environment';

describe('LobbyService', () => {
  let service: LobbyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LobbyService]
    });
    service = TestBed.inject(LobbyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding.
  });

  it('searchByInviteCode should return expected data', () => {
    const mockLobby = {
        _id: "6604520f333d856fd89719f5",
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
     }; // Mock response

    service.searchByInviteCode('17.0407').subscribe(lobby => {
      return expect(lobby).toEqual(mockLobby);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}openhunts/invite/17.0407`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLobby); // Simulate successful response
  });

  // Additional tests here...

});
