import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HuntService } from './hunt.service';
import { TaskService } from './task.service';
import { Hunt } from './hunt';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Task } from './task';

@Component({
  selector: 'app-hunt-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    RouterModule]
})
export class HuntEditComponent implements OnInit {
  hunt: Hunt;

  constructor(
    private route: ActivatedRoute,
    private huntService: HuntService,
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  editTaskForm: FormArray = this.formBuilder.array([]);

  editHuntForm = this.formBuilder.group({
    title: ['', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)])],
    description: ['', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(140)])],
    editTaskForm: this.editTaskForm
  });



  get tasks() {
    return this.editTaskForm as FormArray;
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params: Params) => this.huntService.getHuntById(params['id'])),
      tap((hunt: Hunt) => {
        this.hunt = hunt;
        this.editHuntForm.patchValue({
          title: this.hunt.title,
          description: this.hunt.description
        });
      }),
      switchMap((hunt: Hunt) => this.taskService.getTasks({ huntid: hunt._id }))
    ).subscribe((tasks: Task[]) => {
      if (tasks && tasks.length > 0) {
        tasks.forEach(task => {
          this.editTaskForm.push(this.createTaskFormGroup(task));
        });
      }
    });
  }

  createTaskFormGroup(task: Task): FormGroup {
    return this.formBuilder.group({
      taskInput: [task.description, [Validators.required, Validators.minLength(2), Validators.maxLength(140)]]
    });
  }

  onSubmit() {
    if (this.editHuntForm.valid) {
      const updatedHunt: Partial<Hunt> = {
        ...this.hunt,
        title: this.editHuntForm.value.title,
        description: this.editHuntForm.value.description
      };

      this.huntService.updateHunt(this.hunt._id, updatedHunt).subscribe(() => {
        this.router.navigate(['/hunts', this.hunt._id]);
      }, error => {
        console.error('An error occurred:', error);
      });

      // this.editTaskForm.controls.forEach((taskFormGroup, index) => {
      //   console.log('taskFormGroup:', taskFormGroup);
      //   console.log('index:', index);
      //   if (taskFormGroup.valid) {
      //     const updatedTask = { description: taskFormGroup.value.taskInput };
      //     console.log('updatedTask:', updatedTask);
      //     if (this.tasks.at(index)) { // Check if the task exists at this index
      //       console.log('Task ID:', this.tasks[index]._id);
      //       // Only update if the task description has changed
      //       if (this.tasks.at(index).value !== updatedTask.description) {
      //         this.taskService.updateTask(this.tasks[index]._id, updatedTask).subscribe(() => {
      //           this.router.navigate(['/hunts', this.hunt._id]);
      //         }, error => {
      //           console.error('An error occurred:', error);
      //         });
      //       }
      //     }
      //   }
      // });
    }
  }

}
