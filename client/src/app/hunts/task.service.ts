import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";


@Injectable({
  providedIn: `root`
})
export class TaskService {

  readonly taskUrl: string = '${environment.apiUrl}tasks';

  private readonly huntKey = 'huntid';

  constructor(private httpClient: HttpClient) {
  }

  getTasks(filters?: { huntid?: string }): Observable<Task[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.huntid) {
        httpParams = httpParams.set(this.huntKey, filters.huntid);
      }
    }

    return this.httpClient.get<Task[]>(this.taskUrl, {
      params: httpParams
    });
  }

  addTask(newTask: Partial<Task>): Observable<string> {
    return this.httpClient.post<{ taskId: string }>(this.taskUrl, newTask).pipe(map(res => res.taskId));
  }

  updateTask(taskId: string, updatedTask: Partial<Task>): Observable<void> {
    return this.httpClient.put<void>(`${this.taskUrl}/${taskId}`, updatedTask);
  }

  deleteTask(taskId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.taskUrl}/${taskId}`);
  }
}

