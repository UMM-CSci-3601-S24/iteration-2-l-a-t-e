import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError } from 'rxjs';
import { MockHuntService } from 'src/testing/hunt.service.mock';
import { HuntService } from './hunt.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddHuntComponent } from './add-hunt.component';




describe('AddHuntComponent', () => {
  let addHuntComponent: AddHuntComponent;
  let addHuntForm: FormGroup;
  let fixture: ComponentFixture<AddHuntComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(HuntService, { useValue: new MockHuntService() });
    TestBed.configureTestingModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatButtonModule,
        MatIconModule,
        AddHuntComponent
    ],
}).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHuntComponent);
    addHuntComponent = fixture.componentInstance;
    fixture.detectChanges();
    addHuntForm = addHuntComponent.addHuntForm;
    expect(addHuntForm).toBeDefined();
    expect(addHuntForm.controls).toBeDefined();
  });

  it('should create', () => {
    expect(addHuntComponent).toBeTruthy();
    expect(addHuntForm).toBeTruthy();
   });

/*   describe('addTask', () => {
    it('should add a new task to tasks array', () => {
      const initialTasksLength = addHuntComponent.tasks.length;
      addHuntComponent.addTask();
      expect(addHuntComponent.tasks.length).toBe(initialTasksLength + 1);
    });

    it('should add a required control to tasks array', () => {
      addHuntComponent.addTask();
      const newTask = addHuntComponent.tasks.controls[addHuntComponent.tasks.length - 1];
      newTask.setValue('');
      expect(newTask.valid).toBeFalsy();
      newTask.setValue('New Task');
      expect(newTask.valid).toBeTruthy();
    });
  });

  describe('removeTask', () => {
    it('should remove a task from tasks array', () => {
      addHuntComponent.addTask(); // Ensure there is a task to remove
      const initialTasksLength = addHuntComponent.tasks.length;
      addHuntComponent.deleteTask(0); // Remove the first task
      expect(addHuntComponent.tasks.length).toBe(initialTasksLength - 1);
    });

    it('should not fail when trying to remove a task from an empty array', () => {
      addHuntComponent.tasks.controls = []; // Ensure tasks array is empty
      expect(() => addHuntComponent.deleteTask(0)).not.toThrow();
    });
  }); */

  describe('Form validation', () => {
    it('should invalidate the form when title is empty', () => {
      addHuntForm.controls['title'].setValue('');
      expect(addHuntForm.valid).toBeFalsy();
    });

    it('should invalidate the form when description is empty', () => {
      addHuntForm.controls['description'].setValue('');
      expect(addHuntForm.valid).toBeFalsy();
    });

    it('should validate the form when title and description are properly filled', () => {
      addHuntForm.controls['title'].setValue('Test Title');
      addHuntForm.controls['description'].setValue('Test Description');
      expect(addHuntForm.valid).toBeTruthy();
    });
  });

  describe('Form submission', () => {
    let huntService: HuntService;
    let router: Router;
    let snackBar: MatSnackBar;

    beforeEach(() => {
      huntService = TestBed.inject(HuntService);
      router = TestBed.inject(Router);
      snackBar = TestBed.inject(MatSnackBar);
    });

    it('should attempt to add a hunt when the form is submitted', () => {
      spyOn(huntService, 'addHunt').and.callThrough();
      addHuntForm.controls['title'].setValue('Test Title');
      addHuntForm.controls['description'].setValue('Test Description');
      addHuntComponent.submitForm();
      expect(huntService.addHunt).toHaveBeenCalledWith(addHuntForm.value);
    });

    it('should navigate to "/hunts/" when the form is successfully submitted', () => {
      spyOn(router, 'navigate').and.callThrough();
      addHuntForm.controls['title'].setValue('Test Title');
      addHuntForm.controls['description'].setValue('Test Description');
      addHuntComponent.submitForm();
      expect(router.navigate).toHaveBeenCalledWith(['/hunts/']);
    });

    it('should open a snackBar when the form is successfully submitted', () => {
      spyOn(snackBar, 'open').and.callThrough();
      addHuntForm.controls['title'].setValue('Test Title');
      addHuntForm.controls['description'].setValue('Test Description');
      addHuntComponent.submitForm();
      expect(snackBar.open).toHaveBeenCalledWith(`Added Hunt ${addHuntForm.value.title}`, null, { duration: 2000 });
    });

    it('should open a snackBar when the form submission fails', () => {
      spyOn(snackBar, 'open').and.callThrough();
      spyOn(huntService, 'addHunt').and.returnValue(throwError({ status: 500, message: 'Server Error' }));
      addHuntForm.controls['title'].setValue('Test Title');
      addHuntForm.controls['description'].setValue('Test Description');
      addHuntComponent.submitForm();
      expect(snackBar.open).toHaveBeenCalledWith(`Problem contacting the server – Error Code: 500\nMessage: Server Error`, 'OK', { duration: 5000 });
    });
  });
});
