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

  it('should submit form when submitForm is called', () => {
    component.addHuntForm.controls['title'].setValue('Test Title');
    component.addHuntForm.controls['description'].setValue('Test Description');
    component.submitForm();
    expect(huntService.addHunt).toHaveBeenCalled();
  });

  it('should submit tasks when submitTasks is called', () => {
    component.isHuntCreated = true;
    component.addTaskInput();
    component.tasks.controls[0].get('taskInput').setValue('Test Task');
    component.submitTasks();
    expect(taskService.addTask).toHaveBeenCalled();
  });
});
