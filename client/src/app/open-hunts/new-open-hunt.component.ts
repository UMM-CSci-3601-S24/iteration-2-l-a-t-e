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
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-new-open-hunt',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule
  ],
  templateUrl: './new-open-hunt.component.html',
  styleUrl: './new-open-hunt.component.scss'
})
export class NewOpenHuntComponent implements OnInit, OnDestroy {
  hunt: Hunt;
  tasks: Task[] = [];
  error: { help: string, httpResponse: string, message: string };

  private ngUnsubscribe = new Subject<void>();

  constructor(private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private huntService: HuntService,
    private taskService: TaskService,
    private formBuilder: FormBuilder) { }

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

  newOpenHuntForm = this.formBuilder.group({
    numberOfGroups: ['', Validators.compose([
      Validators.required,
      Validators.min(1),
      Validators.max(50) //Note: may be too high
    ])]
  });

  getErrorMessage(controlName: string) {
    const control = this.newOpenHuntForm.get(controlName);

    if (control.hasError('required')) {
      return 'You must enter a value';
    }
  }
}
