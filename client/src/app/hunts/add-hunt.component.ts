import { Component } from '@angular/core';
import { /* FormArray,  */FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HuntService } from './hunt.service';

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


  constructor(
    private huntService: HuntService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router) { }

  addHuntForm = this.formBuilder.group({
    title: ['', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30)])],
    description: ['', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)])],
    /* tasks: this.formBuilder.array([this.formBuilder.control('', Validators.compose([
      Validators.required,
      Validators.maxLength(50)]))]), */
  });

  /* get tasks() {
    return this.addHuntForm.get('tasks') as FormArray;
  }

  addTask() {
    this.tasks.push(this.formBuilder.control('', Validators.compose([
      Validators.required,
      Validators.maxLength(50)])));
  }

  deleteTask(index: number) {
    if (this.tasks.length > 1) {
      this.tasks.removeAt(index);
    } else {
      this.snackBar.open(
        'At least one task is required.',
        null,
        { duration: 2000 }
      );
    }
  } */

  readonly addHuntValidationMessages = {
    title: [
      { type: 'required', message: 'Title is required' },
      { type: 'maxlength', message: 'Title cannot be more than 30 characters long' },
      { type: 'minlength', message: 'Title must be more than 2 characters long' }

    ],

    description: [
      { type: 'required', message: 'Description is required' },
      { type: 'maxlength', message: 'Description cannot be more than 50 characters long' },
      { type: 'minlength', message: 'Description must be more than 2 characters long' }
    ],

    /* task: [
      { type: 'required', message: 'Task is required' },
      { type: 'maxlength', message: 'Task cannot be more than 50 characters long' },
    ] */
  };

  formControlHasError(controlName: string): boolean {
    return this.addHuntForm.get(controlName).invalid &&
      (this.addHuntForm.get(controlName).dirty || this.addHuntForm.get(controlName).touched);
  }

  /* getTaskErrorMessage(index: number): string {
    const taskControl = this.tasks.at(index);
    for (const error of this.addHuntValidationMessages.task) {
      if (taskControl.hasError(error.type)) {
        return error.message;
      }
    }
    return '';
  } */


  getErrorMessage(name: keyof typeof this.addHuntValidationMessages): string {
    for (const { type, message } of this.addHuntValidationMessages[name]) {
      if (this.addHuntForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    this.huntService.addHunt(this.addHuntForm.value).subscribe({
      next: () => {
        this.snackBar.open(
          `Added Hunt ${this.addHuntForm.value.title}`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/hunts/']);
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      },
    });
  }
}
