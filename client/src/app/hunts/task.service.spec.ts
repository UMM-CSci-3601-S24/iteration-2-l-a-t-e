import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TaskService } from "./task.service";
import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { Task } from "./task";


describe('TaskService', () => {
  const testTasks: Task[] = [
    {
      _id: 'task1_id',
      description: 'task1',
      huntid: 'hunt1_id',
    },
    {
      _id: 'task2_id',
      description: 'task2',
      huntid: 'hunt2_id',
    },
    {
      _id: 'task3_id',
      description: 'task3',
      huntid: 'hunt3_id',
    }
  ];
  let taskService: TaskService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    taskService = TestBed.inject(TaskService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('When getTasks() is called with no parameters', () => {

    it('calls `api/tasks`', () => {

      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTasks));

      taskService.getTasks().subscribe(() => {

        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('When getTasks() is called with a huntid', () => {

    it('calls `api/tasks` with the huntid as a parameter', () => {

      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTasks));

      taskService.getTasks({ huntid: 'hunt1_id' }).subscribe(() => {

        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
      });
    });
  });


  it('should delete a task', () => {
    taskService.deleteTask('test_task_id').subscribe();

    const req = httpTestingController.expectOne(`${taskService.taskUrl}/test_task_id`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should add a task', () => {
    const newTask = { description: 'Test task', huntid: 'hunt1_id' };
    const expectedResponse = { taskId: 'test_task_id' };

    taskService.addTask(newTask).subscribe(taskId => {
      expect(taskId).toEqual(expectedResponse.taskId);
    });

    const req = httpTestingController.expectOne(taskService.taskUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newTask);

    req.flush(expectedResponse);
  });

  it('should update a task', () => {
    const taskId = 'test_task_id';
    const updatedTask = { description: 'Updated task', huntid: 'hunt1_id' };

    taskService.updateTask(taskId, updatedTask).subscribe(() => {
      // If the request completes successfully, we don't need to do anything here
    });

    const req = httpTestingController.expectOne(`${taskService.taskUrl}/${taskId}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(updatedTask);

    req.flush(null);
  });
});

