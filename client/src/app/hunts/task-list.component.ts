import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Subject, takeUntil } from "rxjs";
import { TaskService } from "./task.service";
import { Task } from "./task";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  imports: [RouterLink, CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule, MatOptionModule, MatRadioModule, MatListModule, MatButtonModule, MatIconModule, MatTooltipModule, TaskListComponent]
})
export class TaskListComponent implements OnInit, OnDestroy {
  public serverFilteredTasks: Task[];
  public tasks: Task[];
  public filteredTasks: Task[];

  public taskDescription: string;

  public huntid: string;
  errMsg = '';
  private ngUnsubscribe = new Subject<void>();

  constructor(private taskService: TaskService, private snackBar: MatSnackBar) {
  }

  getTasksFromServer(): void {
    this.taskService.getTasks({
      huntid: this.huntid,
    }).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedTasks) => {
        this.serverFilteredTasks = returnedTasks;
      },
      // error: (err) => {
      //   if (err.error instanceof ErrorEvent) {
      //     this.errMsg = `Problem in the client: ${err.error.message}`;
      //   } else {
      //     this.errMsg = `Problem on the server - Error Code: ${err.status}\nMessage: ${err.message}`;
      //   }
      //   this.snackBar.open(
      //     this.errMsg,
      //     'OK',
      //     { duration: 6000 });
      // },
    });
  }


  ngOnInit(): void {
    this.getTasksFromServer();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
