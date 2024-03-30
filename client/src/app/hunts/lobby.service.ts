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

  getGroupById(id: string): Group {
    let found: Group = null;
    this.httpClient.get<Group>(`${this.lobbyUrl}/group/${id}`).subscribe(
      (group: Group) => {
        found = group;
      },
      (error) => {
        console.error('Error fetching open hunts:', error);
      }
    );
    return found;
  }

  getOpenHuntById(id: string): Observable<Lobby> {
    return this.httpClient.get<Lobby>(`${this.lobbyUrl}/${id}`);
  }

  addNewOpenHunt(newOpenHunt: Partial<Lobby>): Observable<string> {
    return this.httpClient.post<{ id: string }>(`${this.lobbyUrl}/new/${newOpenHunt._id}`, newOpenHunt)
      .pipe(map(res => res.id));
  }

  addNewHunterByOpenHuntId(openHuntId: string): Observable<string> {
    return this.httpClient.post<{ id: string }>(`${this.lobbyUrl}/hunter/${openHuntId}`, null).pipe(map(res => res.id));
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
  numberOfGroups: number;
  groupIds: string[];
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
  _id: string;
  hunterName: string;
}
