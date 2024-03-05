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
import { switchMap } from 'rxjs';

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
    this.route.params.pipe(
      switchMap((params: Params) => this.huntService.getHuntById(params['id'])))
      .subscribe((hunt: Hunt) => {
        this.hunt = hunt;
        this.editHuntForm.patchValue({
          title: this.hunt.title,
          description: this.hunt.description
        });
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
        // handle successful update
      }, error => {
        console.error('An error occurred:', error);
      });
    }
  }

}
