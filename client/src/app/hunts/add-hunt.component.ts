import { Component } from '@angular/core';
import { FormArray,  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HuntService } from './hunt.service';
import { TaskService } from './task.service'; // Import TaskService
import { Task } from './task'; // Import Task

@Component({
  selector: 'app-add-hunt',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule],
  templateUrl: './add-hunt.component.html',
  styleUrl: './add-hunt.component.scss'
})
export class AddHuntComponent {
  currentHuntId: string; // Add a variable to store the current hunt id
  isHuntCreated = false; // Add a flag to check if a hunt is created

  constructor(
    private huntService: HuntService,
    private taskService: TaskService, // Inject TaskService
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router) { }
    currentHost = "kk"

  addHuntForm = this.formBuilder.group({
    title: ['', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)])],
    description: ['', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(140)])],
    estimatedTime: ['', Validators.compose([
      Validators.required,
      Validators.maxLength(3),
      Validators.pattern("^[1-9][0-9]{0,2}$")])]
  });

  addTaskForm = this.formBuilder.group({
    tasks: this.formBuilder.array([
      this.createTaskFormGroup()
    ])
  });

  createTaskFormGroup(): FormGroup {
    return this.formBuilder.group({
      taskInput: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(140)]]
    });
  }

  get tasks() {
    return this.addTaskForm.get('tasks') as FormArray;
  }

  // formControlHasError(controlName: string, errorName: string = 'required'): boolean {
  //   return this.addHuntForm.controls[controlName].hasError(errorName);
  // }

  formControlHasError(controlName: string): boolean {
    const control = this.addHuntForm.get(controlName);
    return control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(controlName: string) {
    const control = this.addHuntForm.get(controlName);

    if (control.hasError('required')) {
      return 'You must enter a value';
    } else {
      return 'Maximum of 3 digits';
    }
    return '';

    // Add other error type handling here if needed
  }

  getTaskErrorMessage(index: number) {
    const task = this.tasks.controls[index];
    if (task.hasError('required')) {
      return 'You must enter a value';
    }
    // Add other error type handling here if needed
  }

  deleteTaskInput(index: number) {
    this.tasks.removeAt(index);
  }

  addTaskInput() {
    this.tasks.push(this.createTaskFormGroup());
  }


  submitAll() {
    const huntData = {
      ...this.addHuntForm.value,
      hostid: this.currentHost
    };

    console.log('Submitting form with data:', huntData); // Log the data being submitted

    this.huntService.addHunt(huntData).subscribe({
      next: (response) => {
        this.currentHuntId = response; // Save the id of the created hunt
        this.isHuntCreated = true; // Set the flag to true
        console.log('Hunt created with ID:', this.currentHuntId); // Log the created hunt ID
        this.snackBar.open(
          `Added Hunt ${this.addHuntForm.value.title}`,
          null,
          { duration: 2000 }
        );

        // Now submit tasks
        const tasks = this.tasks.value;
        console.log('Tasks:', tasks); // Log tasks
        tasks.forEach(taskDescription => {
          const task: Partial<Task> = {
            description: taskDescription.taskInput,
            huntid: this.currentHuntId
          };
          console.log('Current Task:', task); // Log current task
          this.taskService.addTask(task).subscribe({
            next: () => {
              console.log('Task added:', taskDescription); // Log the added task
              if (tasks[tasks.length - 1] === taskDescription) {
                this.router.navigate(['/hunts']);
              }
            },
            error: err => {
              console.log('Error:', err); // Log error
              this.snackBar.open(
                `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
                'OK',
                { duration: 5000 }
              );
            },
          });
        });
      },
      error: err => {
        console.log('Error occurred:', err); // Log the error
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      },
    });
  }


}
