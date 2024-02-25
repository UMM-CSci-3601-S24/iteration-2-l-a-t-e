import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-hunt',
  standalone: true,
  imports: [],
  templateUrl: './add-hunt.component.html',
  styleUrl: './add-hunt.component.scss'
})
export class AddHuntComponent {

  public addHuntForm: FormGroup;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {
    this.addHuntForm = this.fb.group({
      tableRows: this.fb.array([],[Validators.required])
    });
    this.addTask();
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      task: ['',[Validators.required,Validators.maxLength(100)]]
    });
  }

  get getFormControls() {
    const control = this.addHuntForm.get('tableRows') as FormArray;
    return control;
  }

  addTask() {
    const control =  this.addHuntForm.get('tableRows') as FormArray;
    control.push(this.createFormGroup());
  }

  removeTask(index:number) {
    const control =  this.addHuntForm.get('tableRows') as FormArray;
    control.removeAt(index);
  }

  onSaveForm() {
    this.snackBar.open(
      `Added task ${this.addHuntForm.value.name}`,null,{ duration: 2000 });this.router.navigate(['/home/']);
  }
}
