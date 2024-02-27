import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Validators, FormArray, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

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
    private formBuilder: FormBuilder) { }

  addHuntForm = this.formBuilder.group({
    title: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
    description: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    tasks: this.formBuilder.array([this.formBuilder.control('', Validators.compose([Validators.required, Validators.maxLength(100)]))]),
  });

  get tasks() {
    return this.addHuntForm.get('tasks') as FormArray;
  }

  addTask() {
    this.tasks.push(this.formBuilder.control('', Validators.compose([
      Validators.required,
      Validators.maxLength(100)])));
  }

  deleteTask(index: number) {
    this.tasks.removeAt(index);
  }

  readonly addHuntValidationMessages = {
    title: [
      { type: 'required', message: 'Title is required' },
      { type: 'maxlength', message: 'Title cannot be more than 30 characters long' }
    ],

    description: [
      { type: 'required', message: 'Description is required' },
      { type: 'maxlength', message: 'Description cannot be more than 50 characters long' }
    ],

    task: [
      { type: 'required', message: 'Task is required' },
      { type: 'maxlength', message: 'Task cannot be more than 200 characters long' }
    ]
  };

  formControlHasError(controlName: string): boolean {
    return this.addHuntForm.get(controlName).invalid &&
      (this.addHuntForm.get(controlName).dirty || this.addHuntForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.addHuntValidationMessages): string {
    for (const { type, message } of this.addHuntValidationMessages[name]) {
      if (this.addHuntForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }
}
