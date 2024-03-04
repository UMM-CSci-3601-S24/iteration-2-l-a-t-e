import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TaskListComponent } from "./task-list.component";
import { TaskService } from "./task.service";
import { MockTaskService } from "src/testing/task.service.mock";
import { Observable, throwError } from "rxjs";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpErrorResponse } from "@angular/common/http";

const COMMON_IMPORTS: unknown[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('Task list', () => {

  let taskList: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, TaskListComponent],
      providers: [{ provide: TaskService, useValue: new MockTaskService() }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      // Create component and test fixture
      fixture = TestBed.createComponent(TaskListComponent);
      // Get the component from the fixture
      taskList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the tasks', () => {
    expect(taskList.serverFilteredTasks.length).toBe(3);
  });

  it('contains a task with taskid "chris"', () => {
    expect(taskList.serverFilteredTasks.some((task: { huntid: string; }) => task.huntid === 'chris')).toBe(true);
  });
});

describe('Misbehaving Task List', () => {
  let taskList: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  let taskServiceStub: {
    getTasks: () => Observable<Task[]>;
  };

  beforeEach(() => {
    // stub TaskService for test purposes
    taskServiceStub = {
      getTasks: () => new Observable(observer => {
        observer.error('getTasks() Observer generates an error');
      }),
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, TaskListComponent],
      providers: [{ provide: TaskService, useValue: taskServiceStub }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TaskListComponent);
      taskList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a TaskService', () => {
    const mockedMethod = spyOn(taskList, 'getTasksFromServer').and.callThrough();
    expect(taskList.serverFilteredTasks)
      .withContext('no tasks when service fails')
      .toBeUndefined();
    expect(taskList.getTasksFromServer)
      .withContext('service method called')
      .toThrow();
    expect(mockedMethod)
      .withContext('service method is called')
      .toHaveBeenCalled();
    expect(taskList.errMsg)
      .withContext('the error message will be')
      .toMatch(/^Problem on the server - Error Code:/);
    console.log(taskList.errMsg);
  },8000);

  it('sets errMsg when getTasksFromServer fails', () => {
    // Arrange
    const errorResponse = new HttpErrorResponse({
      error: 'Http failure response for (unknown url): 500 Internal Server Error',
      status: 500,
      statusText: 'Internal Server Error'
    });

    spyOn(taskServiceStub, 'getTasks').and.returnValue(throwError(errorResponse));

    // Act
    taskList.getTasksFromServer();

    // Assert
    expect(taskList.errMsg).toBe('Problem on the server - Error Code: 500\nMessage: Http failure response for (unknown url): 500 Internal Server Error');
  });

  it('sets errMsg when getTasksFromServer fails with a client-side error', () => {
    // Arrange
    const errorEvent = new ErrorEvent('Client error', { message: 'test client error' });
    const errorResponse = new HttpErrorResponse({ error: errorEvent });

    spyOn(taskServiceStub, 'getTasks').and.returnValue(throwError(errorResponse));

    // Act
    taskList.getTasksFromServer();

    // Assert
    expect(taskList.errMsg).toBe('Problem in the client: test client error');
  });

});
