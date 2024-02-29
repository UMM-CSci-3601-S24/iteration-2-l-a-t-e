/* import { CommonModule, Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; */
import { ComponentFixture, TestBed, /* fakeAsync, flush, tick, */ waitForAsync } from '@angular/core/testing';
import { /* AbstractControl, */ FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/* import { Router } from '@angular/router';
 */import { RouterTestingModule } from '@angular/router/testing';
/* import { of, throwError } from 'rxjs';
 */import { MockHuntService } from 'src/testing/hunt.service.mock';
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

  describe('addTask', () => {
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
  });
});
