import { HttpClient } from "@angular/common/http";
import { OpenHunt } from "./openHunt"
import { OpenHuntService } from "./openHunt.service";
import { HttpTestingController } from "@angular/common/http/testing";


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
    huntService = TestBed.inject(HuntService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

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
});
