import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Hunt } from './hunt';
import { HuntService } from './hunt.service';

describe('HuntService', () => {
  // A small collection of test hunts
  const testHunts: Hunt[] = [
    {
      _id: 'hunt1_id',
      hostid: 'chris',
      title: 'Chris\'s Hunt',
      description: 'Chris\'s test hunt',
      tasks: []
    },
    {
      _id: 'hunt2_id',
      hostid: 'pat',
      title: 'Pat\'s Hunt',
      description: 'Pat\'s test hunt',
      tasks: []
    },
    {
      _id: 'hunt3_id',
      hostid: 'jamie',
      title: 'Jamie\'s Hunt',
      description: 'Jamie\'s test hunt',
      tasks: []
    }
  ];
let huntService: HuntService;
let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

beforeEach(() => {
  // Set up the mock handling of the HTTP requests
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  });

  httpClient = TestBed.inject(HttpClient);
  httpTestingController = TestBed.inject(HttpTestingController);
  huntService = TestBed.inject(HuntService);
});

afterEach(() => {
  // After every test, assert that there are no more pending requests.
  httpTestingController.verify();
});

describe('When getHunts() is called with no parameters', () => {

  it('calls `api/hunts`', waitForAsync(() => {

    const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testHunts));

    huntService.getHunts().subscribe(() => {

      expect(mockedMethod)
        .withContext('one call')
        .toHaveBeenCalledTimes(1);

      expect(mockedMethod)
        .withContext('talks to the correct endpoint')
        .toHaveBeenCalledWith('api/hunts', { params: new HttpParams() });
    });
  }));
});
});
