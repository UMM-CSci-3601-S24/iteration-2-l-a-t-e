import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { OpenHunt } from "./openHunt";
import { Observable, Subject, map, tap } from "rxjs";

@Injectable({
  providedIn: `root`
})
export class OpenHuntService {
  // URL for openHunts part of server API
  readonly openHuntUrl: string = `${environment.apiUrl}openhunts`
  readonly addOpenHuntUrl: string = `${environment.apiUrl}openhunts/new/:id`

  private readonly hostKey = 'hostid';

  constructor(private httpClient: HttpClient) {
  }

  getOpenHunts(filters?: { hostid?: string }): Observable<OpenHunt[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.hostid) {
        httpParams = httpParams.set(this.hostKey, filters.hostid);
      }
    }

    return this.httpClient.get<OpenHunt[]>(this.openHuntUrl, {
      params: httpParams
    });
  }

  getOpenHuntById(id: string): Observable<OpenHunt> {
    // The input to get could also be written as (this.openHuntUrl + '/' + id)
    return this.httpClient.get<OpenHunt>(`${this.openHuntUrl}/${id}`);
  }

  addOpenHunt(newHunt: Partial<OpenHunt>): Observable<string> {
    // Send post request to add a new hunt with the user data as the body.
    return this.httpClient.post<{ id: string }>(this.openHuntUrl, newHunt).pipe(map(res => res.id));
  }

  openHuntDeleted = new Subject<void>();

  deleteOpenHunt(huntId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.openHuntUrl}/${huntId}`).pipe(
      tap(() => {
        // Emit the huntDeleted event
        this.openHuntDeleted.next();
      })
    );
  }





}
