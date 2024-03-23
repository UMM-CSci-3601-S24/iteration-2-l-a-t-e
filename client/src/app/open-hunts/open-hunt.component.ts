import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { Hunt } from '../hunts/hunt';
import { Task } from '../hunts/task';
import { HuntService } from '../hunts/hunt.service';
import { TaskService } from '../hunts/task.service';



@Component({
  selector: 'app-open-hunt',
  standalone: true,
  imports: [
    MatCardModule
  ],
  templateUrl: './open-hunt.component.html',
  styleUrl: './open-hunt.component.scss'
})
export class OpenHuntComponent implements OnInit, OnDestroy{
  hunt: Hunt;
  tasks: Task[] = [];
  error: { help: string, httpResponse: string, message: string };

  private ngUnsubscribe = new Subject<void>();

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private huntService: HuntService, private taskService: TaskService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('id')),
      switchMap((id: string) => this.huntService.getHuntById(id)),
      switchMap((hunt: Hunt) => {
        this.hunt = hunt;
        return this.taskService.getTasks({ huntid: hunt._id });
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
      },
      error: _err => {
        this.error = {
          help: 'There was a problem loading the hunt - try again.',
          httpResponse: _err.message,
          message: _err.error?.title,
        };
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();

    this.ngUnsubscribe.complete();
  }
}
