import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {
  readonly lobbyUrl: string = `${environment.apiUrl}openhunts`;

  private readonly idKey = 'id';
  inviteCode: string;
  username: string;
  lobbies: Lobby[] = [];
  lobby: Lobby;
  groups: Group[];

  constructor(private httpClient: HttpClient) {
    this.lobbies = this.getAllOpenHunts();
  }
  searchByInviteCode(): Lobby {
    if (this.inviteCode) {
      this.lobby = this.lobbies.find(lobby => lobby.invitecode.trim() === this.inviteCode.trim());
    } else {
      console.error('Please enter a valid invite code.');
    }
    return this.lobby;
  }
  getInviteCode()
  {
    return this.inviteCode;
  }

  setInviteCode(input)
  {
    this.inviteCode = input;
  }
  getUsername()
  {
    return this.username;
  }

  setUsername(input)
  {
    this.username = input;
  }

  getAllOpenHunts(): Lobby[] {
    this.httpClient.get<Lobby[]>(this.lobbyUrl).subscribe(
      (lobbies: Lobby[]) => {
        this.lobbies = lobbies;
      },
      (error) => {
        console.error('Error fetching open hunts:', error);
      }
    );
    return this.lobbies;
  }

  getGroupById(id: string): Observable<Group> {
    // Directly return the Observable from HttpClient
    return this.httpClient.get<Group>(`${this.lobbyUrl}/group/${id}`);
  }


  getOpenHuntById(id: string): Observable<Lobby> {
    return this.httpClient.get<Lobby>(`${this.lobbyUrl}/${id}`);
  }

  addNewOpenHunt(newOpenHunt: Partial<Lobby>): Observable<string> {
    return this.httpClient.post<{ id: string }>(`${this.lobbyUrl}/new/${newOpenHunt._id}`, newOpenHunt)
      .pipe(map(res => res.id));
  }

  addNewHunterByOpenHuntId(openHuntId: string, hunterData: Partial<Hunter>): Observable<string> {

    return this.httpClient.post<{ id: string }>(`${this.lobbyUrl}/hunter/${openHuntId}`, hunterData).pipe(
      map(res => res.id) // Extracts and returns the group ID from the response
    );

  }

}

export interface Lobby {
  _id: {
    $oid: string;
  };
  active: boolean;
  hostid: string;
  huntid: string;
  title: string;
  description: string;
  invitecode: string;
  numberofgroups: number;
  groupids: string[];
}

export interface Group {
  _id: {
    $oid: string;
  };
  groupName: string;
  hunterIds: string[];
  hunters: Hunter[];
}

export interface Hunter {
  _id: {
    $oid: string;
  };
  hunterName: string;
}
