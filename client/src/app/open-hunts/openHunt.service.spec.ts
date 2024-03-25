import { HttpClient, HttpParams } from "@angular/common/http";
import { OpenHunt } from "./openHunt"
import { OpenHuntService } from "./openHunt.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { of } from "rxjs";


describe('OpenHuntSevice', () => {
  const testOpenHunts: OpenHunt[] = [
    {
      _id: 'hunt1_id',
      invitecode: 'hunt1',
      active: true,
      numberofgroups: 1,
      groupids: ["group1"]
    },
    {
      _id: 'hunt2_id',
      invitecode: 'hunt2',
      active: true,
      numberofgroups: 2,
      groupids: ["group1", "group2"]
    },
    {
      _id: 'hunt3_id',
      invitecode: 'hunt3',
      active: true,
      numberofgroups: 3,
      groupids: ["group1", "group2", "group3"]
    },
    {
      _id: 'hunt4_id',
      invitecode: 'hunt4',
      active: false,
      numberofgroups: 4,
      groupids: ["group1", "group2", "group3", "group4"]
    }
  ];

  let openHuntService: OpenHuntService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    openHuntService = TestBed.inject(OpenHuntService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });
/**
  describe('test', () => {
    it('should get active hunts', () => {
      openHuntService.getActive().subscribe(hunts => {
        expect(hunts.length).toBe(4);
        expect(hunts).toEqual(testOpenHunts);

        const req = httpTestingController.expectOne('api/openHunt/active');
        expect(req.request.method).toEqual('GET');
      });
    })
  });
   */

  describe('When getHunts() is called with no parameters', () => {

    it('calls `api/hunts`', waitForAsync(() => {

      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testOpenHunts));

      openHuntService.getOpenHunts().subscribe(() => {

        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);

        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(openHuntService.openHuntUrl, { params: new HttpParams() });
      });
    }));
  });
  describe('When getHunts() is called with parameters', () => {

    it('correctly calls `api/hunts` with parameters', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testOpenHunts));

      openHuntService.getOpenHunts({ hostid: 'chris' }).subscribe(() => {

          expect(mockedMethod)
            .withContext('one call')
            .toHaveBeenCalledTimes(1);

          expect(mockedMethod)
            .withContext('talks to the correct endpoint')
            .toHaveBeenCalledWith(openHuntService.openHuntUrl, { params: new HttpParams().set('hostid', 'chris') });
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
       const targetHunt: OpenHunt = testOpenHunts[1];
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
       openHuntService.getOpenHuntById(targetId).subscribe(() => {
         // The `Hunt` returned by `getHuntById()` should be targetHunt, but
         // we don't bother with an `expect` here since we don't care what was returned.
         expect(mockedMethod)
           .withContext('one call')
           .toHaveBeenCalledTimes(1);
         expect(mockedMethod)
           .withContext('talks to the correct endpoint')
           .toHaveBeenCalledWith(`${openHuntService.openHuntUrl}/${targetId}`);
       });
     }));
   });

   describe('When addHunt() is called', () => {
      it('calls `api/hunts` with the correct body', waitForAsync(() => {
        const newHunt: Partial<OpenHunt> = {
          invitecode: 'hunt5',
          active: false,
          numberofgroups: 5,
          groupids: ["group1", "group2", "group3", "group4","group5"]
        };

        const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of({ hostid: 'chris' }));

        openHuntService.addOpenHunt(newHunt).subscribe(() => {
          expect(mockedMethod)
            .withContext('one call')
            .toHaveBeenCalledTimes(1);
          expect(mockedMethod)
            .withContext('talks to the correct endpoint')
            .toHaveBeenCalledWith(openHuntService.openHuntUrl, newHunt);
        });
      }));
    });


});
