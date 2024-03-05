import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HuntService } from './hunt.service';
import { TaskService } from './task.service';
import { Hunt } from './hunt';
import { Task } from './task';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
    MatIconModule]
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

  editHuntForm = this.formBuilder.group({
    title: ['', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)])],
    description: ['', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(140)])],
  });

  editTaskForm: FormArray = this.formBuilder.array([]);

  get tasks() {
    return this.editTaskForm.get('tasks') as FormArray;
  }

  createTaskFormGroup(): FormGroup {
    return this.formBuilder.group({
      taskInput: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(140)]]
    });
  }

  ngOnInit(): void {
    this.tasks.controls.forEach((taskControl: FormGroup) => {
      const task = taskControl.value as Task;
      this.editTaskForm.push(this.formBuilder.group({
        taskInput: [task.description, [Validators.required, Validators.minLength(2), Validators.maxLength(140)]]
      }));
    });
  }

  onSubmit(): void {
    this.huntService.updateHunt(this.hunt._id, this.editHuntForm.value).subscribe();
    this.tasks.controls.forEach((taskControl, index) => {
      this.taskService.updateTask(this.tasks[index]._id, { description: taskControl.value.taskInput }).subscribe();
    });
  }

  addTaskInput() {
    this.tasks.push(this.createTaskFormGroup());
  }

  deleteTaskInput(index: number) {
    this.tasks.removeAt(index);
    this.taskService.deleteTask(this.tasks[index]._id).subscribe();
  }

}
