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

  constructor(private httpClient: HttpClient) {}

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

  getAllOpenHunts(): Observable<Lobby[]> {
    return this.httpClient.get<Lobby[]>(this.lobbyUrl);
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
  numberofgroups: number;
  groupids: string[];
}
