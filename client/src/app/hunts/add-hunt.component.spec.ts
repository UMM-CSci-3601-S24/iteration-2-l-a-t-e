import { AddHuntComponent } from './add-hunt.component';
import { FormBuilder } from '@angular/forms';
import { HuntService } from './hunt.service';
import { TaskService } from './task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AddHuntComponent', () => {
  let component: AddHuntComponent;
  let huntService: HuntService;
  let taskService: TaskService;
  let formBuilder: FormBuilder;
  let snackBar: MatSnackBar;
  let router: Router;

  beforeEach(() => {
    // Mock services and FormBuilder
    huntService = jasmine.createSpyObj('HuntService', ['addHunt']);
    (huntService.addHunt as jasmine.Spy).and.returnValue(of(null));
    taskService = jasmine.createSpyObj('TaskService', ['addTask']);
    (taskService.addTask as jasmine.Spy).and.returnValue(of(null));
    formBuilder = new FormBuilder();
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    // Initialize component
    component = new AddHuntComponent(huntService, taskService, formBuilder, snackBar, router);
  });

  it('should create a form with title and description', () => {
    expect(component.addHuntForm.contains('title')).toBeTruthy();
    expect(component.addHuntForm.contains('description')).toBeTruthy();
  });

  it('should create a form with tasks', () => {
    expect(component.addTaskForm.contains('tasks')).toBeTruthy();
  });

  it('should add a task input when addTaskInput is called', () => {
    const initialTasksLength = component.tasks.length;
    component.addTaskInput();
    expect(component.tasks.length).toBe(initialTasksLength + 1);
  });

  it('should remove a task input when deleteTaskInput is called', () => {
    component.addTaskInput(); // Ensure there is a task to remove
    const initialTasksLength = component.tasks.length;
    component.deleteTaskInput(0); // Remove the first task
    expect(component.tasks.length).toBe(initialTasksLength - 1);
  });

  it('should not fail when trying to remove a task input from an empty array', () => {
    component.tasks.controls = []; // Ensure tasks array is empty
    expect(() => component.deleteTaskInput(0)).not.toThrow();
  });

  it('should submit form and tasks when submitAll is called', () => {
    // Set up the form and tasks
    component.addHuntForm.controls['title'].setValue('Test Title');
    component.addHuntForm.controls['description'].setValue('Test Description');
    component.addHuntForm.controls['estimatedTime'].setValue('Test Estimated Time');
    component.addTaskInput();
    component.tasks.controls[0].get('taskInput').setValue('Test Task');

    // Call the new method
    component.submitAll();

    // Check that the services were called
    expect(huntService.addHunt).toHaveBeenCalled();
    expect(taskService.addTask).toHaveBeenCalled();
  });

  // it('should return true if a form control has an error', () => {
  //   component.addHuntForm.controls['title'].setErrors({ required: true });
  //   expect(component.addHuntForm.get('title').setValue(''));
  // });

  it('should return false if a form control does not have an error', () => {
    component.addHuntForm.controls['title'].setErrors(null);
    expect(component.formControlHasError('title')).toBeFalse();
  });

  it('should return an error message if a form control has an error', () => {
    component.addHuntForm.controls['title'].setErrors({ required: true });
    expect(component.getErrorMessage('title')).toBe('You must enter a value');
  });

  // it('should not return an error message if a form control does not have an error', () => {
  //   component.addHuntForm.controls['title'].setValue('');
  //   expect(component.addHuntForm.controls['title'].valid).toBeTrue();
  // });
  // it('should not return an error message if a form control does not have an error', () => {
  //   component.addHuntForm.controls['title'].setErrors(null);
  //   expect(component.addHuntForm.get('title').setValue(''));
  // });

  it('should return an error message if a task has an error', () => {
    component.addTaskInput();
    component.tasks.controls[0].setErrors({ required: true });
    expect(component.getTaskErrorMessage(0)).toBe('You must enter a value');
  });

  it('should not return an error message if a task does not have an error', () => {
    component.addTaskInput();
    component.tasks.controls[0].setErrors(null);
    expect(component.getTaskErrorMessage(0)).toBeUndefined();
  });
});
