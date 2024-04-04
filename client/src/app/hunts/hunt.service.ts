import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Hunt } from './hunt';


@Injectable({
  providedIn: `root`
})
export class HuntService {
  // The URL for the hunts part of the server API.
  readonly huntUrl: string = `${environment.apiUrl}hunts`;

  private readonly hostKey = 'hostid';

  username: string;
  password: string;

  constructor(private httpClient: HttpClient) {
  }

  /**
  *  @param filters a map that allows us to specify a target hostid
  *  @returns an `Observable` of an array of `Hunts`. Wrapping the array
  *   in an `Observable` means that other bits of of code can `subscribe` to
  *   the result (the `Observable`) and get the results that come back
  *   from the server after a possibly substantial delay (because we're
  *   contacting a remote server over the Internet).
  */
  getHunts(filters?: { hostid?: string }): Observable<Hunt[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.hostid) {
        httpParams = httpParams.set(this.hostKey, filters.hostid);
      }
    }

    return this.httpClient.get<Hunt[]>(this.huntUrl, {
      params: httpParams
    });
  }

  /**
  * Get the `Hunt` with the specified ID.
  *
  * @param id the ID of the desired user
  * @returns an `Observable` containing the resulting hunt.
  */
  getUsername()
  {
    return this.username;
  }
  getPassword()
  {
    return this.password;
  }

  setUsername(value: string)
  {
    this.username = value;
  }
  setPassword(value: string)
  {
    this.password = value;
  }

  getHuntById(id: string): Observable<Hunt> {
    // The input to get could also be written as (this.huntUrl + '/' + id)
    return this.httpClient.get<Hunt>(`${this.huntUrl}/${id}`);
  }

  addHunt(newHunt: Partial<Hunt>): Observable<string> {
    // Send post request to add a new hunt with the user data as the body.
    return this.httpClient.post<{ id: string }>(this.huntUrl, newHunt).pipe(map(res => res.id));
  }

  updateHunt(huntId: string, updatedHunt: { title?: string, description?: string, estimatedTime?: number}): Observable<void> {
    return this.httpClient.put<void>(`${this.huntUrl}/${huntId}`, updatedHunt);
  }

  huntDeleted = new Subject<void>();

  deleteHunt(huntId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.huntUrl}/${huntId}`).pipe(
      tap(() => {
        // Emit the huntDeleted event
        this.huntDeleted.next();
      })
    );
  }
}
