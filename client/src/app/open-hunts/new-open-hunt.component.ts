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
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { OpenHuntService } from './openHunt.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-new-open-hunt',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
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

  currentHuntId: string; // Add a variable to store the current hunt id
  isHuntCreated = false; // Add a flag to check if a hunt is created

  private ngUnsubscribe = new Subject<void>();

  constructor(private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private huntService: HuntService,
    private taskService: TaskService,
    private openHuntService: OpenHuntService,
    private formBuilder: FormBuilder,
    private router: Router) { }
    currentHost = "kk"

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

  readonly addOpenHuntValidationMessages = {
    numberofgroups: [
      {type: 'required', message: 'Group number is required'},
      {type: 'min', message: 'Group number must be at least 1'},
      {type: 'max', message: 'Group number may not be greater than 50'},
      {type: 'pattern', message: 'Group number must be a whole number'}
    ]
  }

  newOpenHuntForm = this.formBuilder.group({
    numberofgroups: [1, Validators.compose([
      Validators.required,
      Validators.min(1),
      Validators.max(50), //Note: may be too high
      Validators.pattern('^[0-9]+$')
    ])]
  });


  formControlHasError(controlName: string): boolean {
    return this.newOpenHuntForm.get(controlName).invalid &&
      (this.newOpenHuntForm.get(controlName).dirty || this.newOpenHuntForm.get(controlName).touched);
  }


  getErrorMessage(name: keyof typeof this.addOpenHuntValidationMessages): string {
    for(const {type, message} of this.addOpenHuntValidationMessages[name]) {
      if (this.newOpenHuntForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }


  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  submitAll() {
    const huntData = {
      active: true,
      hostid: this.currentHost,
      huntid: this.hunt._id,
      title: this.hunt.title,
      description: this.hunt.description,
      invitecode: String(this.getRandomInt(1 * Math.pow(10, 10))),
      ...this.newOpenHuntForm.value,
      groupids: [],
      groups: [],
    };

    console.log('Submitting form with data:', huntData); // Log the data being submitted

    this.openHuntService.addOpenHunt(huntData).subscribe({
      next: (response) => {
        this.currentHuntId = response; // Save the id of the created hunt
        this.isHuntCreated = true; // Set the flag to true
        console.log('Hunt created with ID:', this.currentHuntId); // Log the created hunt ID
        this.snackBar.open(
          `Added Hunt`,
          null,
          { duration: 2000 }
        )
        this.router.navigate(['openhunts/',this.currentHuntId]); // Where the submit button should route to (the opened hunt)


      },
      error: err => {
        console.log('Error occurred:', err); // Log the error
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      }
    })


  }


}
