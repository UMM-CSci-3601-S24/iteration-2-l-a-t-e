import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { Task } from "./task";


@Injectable({
  providedIn: `root`
})
export class TaskService {

  readonly taskUrl: string = `${environment.apiUrl}tasks`;

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

  getTaskById(taskId: string): Observable<Task> {
    return this.httpClient.get<Task>(`${this.taskUrl}/${taskId}`);
  }

  addTask(newTask: Partial<Task>): Observable<string> {
    return this.httpClient.post<{ id: string }>(this.taskUrl, newTask).pipe(map(res => res.id));
  }

  updateTask(taskId: string, updatedTask: { description: string }): Observable<void> {
    return this.httpClient.put<void>(`${this.taskUrl}/${taskId}`, updatedTask);
  }

  deleteTask(taskId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.taskUrl}/${taskId}`);
  }
}

