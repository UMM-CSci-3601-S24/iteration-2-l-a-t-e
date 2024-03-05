import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Hunt } from './hunt';
import { HuntService } from './hunt.service';
import { MockHuntService } from 'src/testing/hunt.service.mock';

describe('HuntService', () => {
  // A small collection of test hunts
  const testHunts: Hunt[] = [
    {
      _id: 'hunt1_id',
      hostid: 'chris',
      title: 'Chris\'s Hunt',
      description: 'Chris\'s test hunt',
    },
    {
      _id: 'hunt2_id',
      hostid: 'pat',
      title: 'Pat\'s Hunt',
      description: 'Pat\'s test hunt',
    },
    {
      _id: 'hunt3_id',
      hostid: 'jamie',
      title: 'Jamie\'s Hunt',
      description: 'Jamie\'s test hunt',
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
          .toHaveBeenCalledWith(huntService.huntUrl, { params: new HttpParams() });
      });
    }));
  });

  describe('When getHunts() is called with parameters', () => {

    it('correctly calls `api/hunts` with parameters', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testHunts));

      huntService.getHunts({ hostid: 'chris' }).subscribe(() => {

          expect(mockedMethod)
            .withContext('one call')
            .toHaveBeenCalledTimes(1);

          expect(mockedMethod)
            .withContext('talks to the correct endpoint')
            .toHaveBeenCalledWith(huntService.huntUrl, { params: new HttpParams().set('hostid', 'chris') });
        });
    });
  });

  describe('When getHuntById() is given an ID', () => {
    /* We really don't care what `getHuntById()` returns. Since all the
     * interesting work is happening on the server, `getHuntById()`
     * is really just a "pass through" that returns whatever it receives,
     * without any "post processing" or manipulation. The test in this
     * `describe` confirms that the HTTP request is properly formed
     * and sent out in the world, but we don't _really_ care about
     * what `getHuntById()` returns as long as it's what the HTTP
     * request returns.
     *
     * So in this test, we'll keep it simple and have
     * the (mocked) HTTP request return the `targetHunt`
     * Furthermore, we won't actually check what got returned (there won't be an `expect`
     * about the returned value). Since we don't use the returned value in this test,
     * It might also be fine to not bother making the mock return it.
     */
     it('calls api/hunts/id with the correct ID', waitForAsync(() => {
       // We're just picking a User "at random" from our little
       // set of Hunts up at the top.
       const targetHunt: Hunt = testHunts[1];
       const targetId: string = targetHunt._id;

       // Mock the `httpClient.get()` method so that instead of making an HTTP request
       // it just returns one hunt from our test data
       const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(targetHunt));

       // Call `huntService.getHunt()` and confirm that the correct call has
       // been made with the correct arguments.
       //
       // We have to `subscribe()` to the `Observable` returned by `getHuntById()`.
       // The `hunt` argument in the function below is the thing of type Hunt returned by
       // the call to `getHuntById()`.
       huntService.getHuntById(targetId).subscribe(() => {
         // The `Hunt` returned by `getHuntById()` should be targetHunt, but
         // we don't bother with an `expect` here since we don't care what was returned.
         expect(mockedMethod)
           .withContext('one call')
           .toHaveBeenCalledTimes(1);
         expect(mockedMethod)
           .withContext('talks to the correct endpoint')
           .toHaveBeenCalledWith(`${huntService.huntUrl}/${targetId}`);
       });
     }));
   });

   describe('When addHunt() is called', () => {
      it('calls `api/hunts` with the correct body', waitForAsync(() => {
        const newHunt: Partial<Hunt> = {
          hostid: 'chris',
          title: 'Chris\'s Hunt',
          description: 'Chris\'s test hunt',
        };

        const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of({ hostid: 'chris' }));

        huntService.addHunt(newHunt).subscribe(() => {
          expect(mockedMethod)
            .withContext('one call')
            .toHaveBeenCalledTimes(1);
          expect(mockedMethod)
            .withContext('talks to the correct endpoint')
            .toHaveBeenCalledWith(huntService.huntUrl, newHunt);
        });
      }));
    });

    describe('MockHuntService', () => {
      let service: MockHuntService;

      beforeEach(() => {
        service = new MockHuntService();
      });

      it('should return a hunt by id', () => {
        const huntId = 'hunt1_id';
        service.getHuntById(huntId).subscribe(hunt => {
          expect(hunt).toEqual(MockHuntService.testHunts[0]);
        });
      });

      it('should return null for a non-existent hunt id', () => {
        const huntId = 'non_existent_id';
        service.getHuntById(huntId).subscribe(hunt => {
          expect(hunt).toBeNull();
        });
      });

      it('should add a hunt', () => {
        const newHunt: Hunt = {
          _id: `hunt${MockHuntService.testHunts.length + 1}_id`,
          hostid: 'new_host',
          title: 'New Hunt',
          description: 'New hunt description',
        };
        service.addHunt(newHunt).subscribe(id => {
          expect(id).toBe(newHunt._id);
          expect(MockHuntService.testHunts[MockHuntService.testHunts.length - 1]).toEqual(newHunt);
        });
      });
    });

   describe('When updateHunt() is called', () => {
    it('calls `api/hunts/id` with the correct ID and updated hunt', waitForAsync(() => {
      const targetHunt: Hunt = testHunts[1];
      const targetId: string = targetHunt._id;
      const updatedHunt: Partial<Hunt> = { title: 'New Title' };

      const mockedMethod = spyOn(httpClient, 'put').and.returnValue(of(null));

      huntService.updateHunt(targetId, updatedHunt).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(`${huntService.huntUrl}/${targetId}`, updatedHunt);
      });
    }));
   });

    describe('When deleteHunt() is called', () => {
      it('calls `api/hunts/id` with the correct ID', waitForAsync(() => {
        const targetHunt: Hunt = testHunts[1];
        const targetId: string = targetHunt._id;

        const mockedMethod = spyOn(httpClient, 'delete').and.returnValue(of(null));

        huntService.deleteHunt(targetId).subscribe(() => {
          expect(mockedMethod)
            .withContext('one call')
            .toHaveBeenCalledTimes(1);
          expect(mockedMethod)
            .withContext('talks to the correct endpoint')
            .toHaveBeenCalledWith(`${huntService.huntUrl}/${targetId}`);
        });
      }));
    });
  });
