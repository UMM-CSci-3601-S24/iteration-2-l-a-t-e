import { Component } from "@angular/core";
import { NgFor } from "@angular/common";
import { Validators, FormArray, FormBuilder, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-add-hunt',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor ],
  templateUrl: './add-hunt.component.html',
  styleUrl: './add-hunt.component.scss'
})
export class AddHuntComponent {

  constructor(private formBuilder: FormBuilder) {}

  huntForm = this.formBuilder.group({
    title: ['',Validators.required],
    description: ['',Validators.required],
    tasks: this.formBuilder.array([this.formBuilder.control('',Validators.required)]),
  });

  get tasks() {
    return this.huntForm.get('tasks') as FormArray;
  }

  addTask() {
    this.tasks.push(this.formBuilder.control('',Validators.required));
  }

  deleteTask(index: number) { // Modified to accept an index parameter for specific task deletion
    this.tasks.removeAt(index);
  }
}
