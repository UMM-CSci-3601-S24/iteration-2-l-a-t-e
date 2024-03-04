import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { AppComponent } from "src/app/app.component";
import { Task } from "src/app/hunts/task";
import { TaskService } from "src/app/hunts/task.service";

@Injectable({
  providedIn: AppComponent
})
export class MockTaskService extends TaskService {
  static testTasks: Task[] = [
    {
      _id: 'task1_id',
      huntid: 'chris',
      description: 'Chris\'s test task',

    },
    {
      _id: 'task2_id',
      huntid: 'pat',
      description: 'Pat\'s test task',

    },
    {
      _id: 'task3_id',
      huntid: 'jamie',
      description: 'Jamie\'s test task',
    }
  ];

  constructor() {
    super(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTasks(_filters: { huntid?: string }): Observable<Task[]> {
    return of(MockTaskService.testTasks);
  }
}
