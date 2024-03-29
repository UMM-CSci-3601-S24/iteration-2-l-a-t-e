package umm3601.hunt;

import umm3601.hunter.Group;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
// import java.util.Collections;
// import java.util.HashMap;
import java.util.List;
import java.util.Map;

// import javax.swing.GroupLayout.Group;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import io.javalin.json.JavalinJackson;
import io.javalin.validation.BodyValidator;
import io.javalin.validation.ValidationException;

@SuppressWarnings({ "MagicNumber" })
public class OpenHuntControllerSpec {

  private OpenHuntController openHuntController;

  // The client and database that will be used
  // for al the tests in this spec file.
  private static MongoClient mongoClient;
  private static MongoDatabase db;

    // Used to translate between JSON and POJOs.
    private static JavalinJackson javalinJackson = new JavalinJackson();

    @Mock
    private Context ctx;

    @Captor
    private ArgumentCaptor<ArrayList<OpenHunt>> openHuntArrayListCaptor;

    @Captor
    private ArgumentCaptor<OpenHunt> openHuntCaptor;

    @Captor
    private ArgumentCaptor<ArrayList<Group>> groupArrayListCaptor;

    @Captor
    private ArgumentCaptor<Group> groupCaptor;

    @Captor
    private ArgumentCaptor<Map<String, String>> mapCaptor;

    private ObjectId groupId1;
    private ObjectId groupId2;
    private ObjectId groupId3;

    private ObjectId openHuntId1;

    private ObjectId hunterId1;
    private  ObjectId hunterId2;

    private List<ObjectId> groupList;


    @BeforeAll
    static void setupAll() {
      String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

      mongoClient = MongoClients.create(
          MongoClientSettings.builder()
              .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
              .build());
      db = mongoClient.getDatabase("test");
    }

    @AfterAll
    static void teardown() {
      db.drop();
      mongoClient.close();
    }


    @BeforeEach
  void setupEach() throws IOException {
    // reset our mock context and argument captor (declared with Mockito
    // annotations @Mock and @Captor).
    MockitoAnnotations.openMocks(this);

    // Setup Database
    MongoCollection<Document> openHuntDocuments = db.getCollection("openHunts");
    openHuntDocuments.drop();
    List<Document> testOpenHunts = new ArrayList<>();

    groupId1 = new ObjectId();
    groupId2 = new ObjectId();
    groupId3 = new ObjectId();

    ObjectId[] groupArray = {groupId1, groupId2, groupId3};
    groupList = Arrays.asList(groupArray);

    openHuntId1 = new ObjectId();
    testOpenHunts.add(
        new Document()
            .append("_id", openHuntId1)
            .append("hostid", "1234567")
            .append("title", "CSCI3601Hunt")
            .append("description", "teamAkaHunt")
            .append("groupids", groupList)
            .append("numberofgroups", 3)
            .append("invitecode", "openHunt1InviteCode"));


    testOpenHunts.add(
        new Document()
            .append("hostid", "1234567")
            .append("title", "KKHunt")
            .append("description", "for event test"));

    testOpenHunts.add(
        new Document()
            .append("hostid", "1234567")
            .append("title", "NicHunt")
            .append("description", "for even test 2"));

    openHuntDocuments.insertMany(testOpenHunts);


    MongoCollection<Document> groupDocuments = db.getCollection("groups");
    groupDocuments.drop();
    List<Document> testGroups = new ArrayList<>();

    hunterId1 = new ObjectId();
    hunterId2 = new ObjectId();

    ObjectId[] hunterArray = {hunterId1, hunterId2};
    List<ObjectId> hunterList = Arrays.asList(hunterArray);

    testGroups.add(
      new Document()
      .append("_id", groupId1)
      .append("groupName", "Group1")
      .append("hunterIds", hunterList));


    testGroups.add(
      new Document()
      .append("_id", groupId2)
      .append("groupName", "Group2"));

    testGroups.add(
      new Document()
      .append("_id", groupId3)
      .append("groupName", "Group3"));

    groupDocuments.insertMany(testGroups);

    MongoCollection<Document> hunterDocuments = db.getCollection("hunters");
    hunterDocuments.drop();
    List<Document> testHunters = new ArrayList<>();

    testHunters.add(
      new Document()
      .append("_id", hunterId1)
      .append("hunterName", "Alija"));

    testHunters.add(
      new Document()
      .append("_id", hunterId2)
      .append("hunterName", "Linnea"));

    hunterDocuments.insertMany(testHunters);

    openHuntController = new OpenHuntController(db);

  }

  @Test
  void addRoutes() {
    Javalin mockServer = mock(Javalin.class);
    openHuntController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(3)).get(any(), any());
    verify(mockServer, Mockito.atLeast(2)).post(any(), any());
  }

  @Test
  void canGetOpenHuntWithExistentIdAndNestedGroupAndHunters() throws IOException {
    when(ctx.pathParam("id")).thenReturn(openHuntId1.toHexString());

    openHuntController.getOpenHunt(ctx);

    verify(ctx).json(openHuntCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals("CSCI3601Hunt", openHuntCaptor.getValue().title);
    assertEquals(openHuntId1.toHexString(), openHuntCaptor.getValue()._id);

    String[] groupArray = {groupId1.toString(), groupId2.toString(), groupId3.toString()};
    assertArrayEquals(groupArray, openHuntCaptor.getValue().groupids);
    assertEquals("Group2", openHuntCaptor.getValue().groups[1].groupName);
    assertEquals("Alija", openHuntCaptor.getValue().groups[0].hunters[0].hunterName);
  }

    /**
   * Test for getOpenHunt() in OpenHuntController with bad Id.
   * This will throw an exception message.
   */
  @Test
  void getOpenHuntWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      openHuntController.getOpenHunt(ctx);
    });

    assertEquals("The requested open hunt id wasn't a legal Mongo Object ID.", exception.getMessage());
  }


    /**
   * Test for getOpenHunt() in OpenHuntController with NonexistentId.
   * This will throw an exception message.
   */
  @Test
  void getOpenHuntWithNonexistentId() throws IOException {
    String id = "280820042908200427082004";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      openHuntController.getOpenHunt(ctx);
    });

    assertEquals("The requested openHunt was not found", exception.getMessage());
  }

  @Test
  void canGetOpenHuntWithExistentInviteCode() throws IOException {
    when(ctx.pathParam("invitecode")).thenReturn("openHunt1InviteCode");

    openHuntController.getOpenHuntByInviteCode(ctx);

    verify(ctx).json(openHuntCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals("CSCI3601Hunt", openHuntCaptor.getValue().title);
    assertEquals(openHuntId1.toHexString(), openHuntCaptor.getValue()._id);
  }

  @Test
  void getOpenHuntWithNonexistentInviteCode() throws IOException {
    String code = "280820042908200427082004";
    when(ctx.pathParam("invitecode")).thenReturn(code);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      openHuntController.getOpenHuntByInviteCode(ctx);

    });

    assertEquals("The requested invite code was not found " + code, exception.getMessage());
  }

  // test not working because bad request response cannot be mocked
  // @Test
  // void getOpenHuntWithBadInviteCode() throws IOException {
  //   when(ctx.pathParam("invitecode")).thenReturn(" ");

  //   Throwable exception = assertThrows(BadRequestResponse.class, () -> {
  //     openHuntController.getOpenHuntByInviteCode(ctx);

  //   });

  //   assertEquals("The requested invite code wasn't a legal Mongo invite code.", exception.getMessage());
  // }

  @Test
  void testGetGroupAndNestedHunters() throws IOException {
    when(ctx.pathParam("id")).thenReturn(groupId1.toHexString());

    openHuntController.getGroup(ctx);

    verify(ctx).json(groupCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals("Group1", groupCaptor.getValue().groupName);
    assertEquals(groupId1.toHexString(), groupCaptor.getValue()._id);

    String[] hunterArray = {hunterId1.toString(), hunterId2.toString()};
    assertArrayEquals(hunterArray, groupCaptor.getValue().hunterIds);
    assertEquals("Linnea", groupCaptor.getValue().hunters[1].hunterName);

  }

  @Test
  void getGroupWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      openHuntController.getGroup(ctx);
    });

    assertEquals("The requested group id wasn't a legal Mongo Object ID.", exception.getMessage());
  }

  @Test
  void getGroupWithNonexistentId() throws IOException {
    String id = "280820042908200427082004";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      openHuntController.getGroup(ctx);
    });

    assertEquals("The requested group was not found", exception.getMessage());
  }

  @Test
  void addOpenHunt() throws IOException {
    String testNewOpenHunt = """
        {
          "active": true,
          "hostid": "1234567",
          "huntid": "7654321",
          "title": "Test title for hunt",
          "description": "this is just a test description",
          "invitecode": "40442",
          "numberofgroups": 3
        }
        """;
    when(ctx.bodyValidator(OpenHunt.class))
        .then(value -> new BodyValidator<OpenHunt>(testNewOpenHunt, OpenHunt.class, javalinJackson));

    openHuntController.addNewOpenHunt(ctx);
    verify(ctx).json(mapCaptor.capture());

    // Our status should be 201, our new open hunt was successfully created.
    verify(ctx).status(HttpStatus.CREATED);

    // Verify that the hunt was added to the database with correct ID.
    Document addedOpenHunt = db.getCollection("openHunts")
        .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

    // Successfully adding the hunt should return newly generated, non-empty
    // MongoDB ID for that hunt.

    ArrayList<String> groupIdsList = (ArrayList<String>) addedOpenHunt.get("groupids");

    assertNotEquals("", addedOpenHunt.get("_id"));
    assertEquals("1234567", addedOpenHunt.get("hostid"));
    assertEquals("Test title for hunt", addedOpenHunt.get("title"));
    assertEquals("this is just a test description", addedOpenHunt.get("description"));
    assertEquals(3, groupIdsList.size());
  }

@Test
void addInvalidTitleTooShortOpenHunt() throws IOException {
  String testNewOpenHunt = """
    {
      "active": true,
      "hostid": "1234567",
      "huntid": "7654321",
      "title": "n",
      "description": "this is just a test description",
      "invitecode": "40442",
      "numberofgroups": 3
    }
    """;

    when(ctx.bodyValidator(OpenHunt.class))
        .then(value -> new BodyValidator<OpenHunt>(testNewOpenHunt, OpenHunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      openHuntController.addNewOpenHunt(ctx);
    });
}

// @Test
// void addInvalidTitleNullOpenHunt() throws IOException {
//   String testNewOpenHunt = """
//     {
//       "active": true,
//       "hostid": "1234567",
//       "huntid": "7654321",
//       "title": "",
//       "description": "this is just a test description",
//       "invitecode": "40442",
//       "numberofgroups": 3
//     }
//     """;

//     when(ctx.bodyValidator(OpenHunt.class))
//         .then(value -> new BodyValidator<OpenHunt>(testNewOpenHunt, OpenHunt.class, javalinJackson));

//     assertThrows(ValidationException.class, () -> {
//       openHuntController.addNewOpenHunt(ctx);
//     });


@Test
void addInvalidDescriptionTooShortOpenHunt() throws IOException {
  String testNewOpenHunt = """
    {
      "active": true,
      "hostid": "1234567",
      "huntid": "7654321",
      "title": "Test title for hunt",
      "description": "",
      "invitecode": "40442",
      "numberofgroups": 3
    }
    """;

    when(ctx.bodyValidator(OpenHunt.class))
        .then(value -> new BodyValidator<OpenHunt>(testNewOpenHunt, OpenHunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      openHuntController.addNewOpenHunt(ctx);
    });
}

@Test
void addInvalidNumberOfGroupsOpenHunt() throws IOException {
  String testNewOpenHunt = """
    {
      "active": true,
      "hostid": "1234567",
      "huntid": "7654321",
      "title": "Test title for hunt",
      "description": "this is just a test description",
      "invitecode": "40442",
      "numberofgroups": -1
    }
    """;

    when(ctx.bodyValidator(OpenHunt.class))
        .then(value -> new BodyValidator<OpenHunt>(testNewOpenHunt, OpenHunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      openHuntController.addNewOpenHunt(ctx);
    });

    String testNewOpenHunt2 = """
      {
        "active": true,
        "hostid": "1234567",
        "huntid": "7654321",
        "title": "Test title for hunt",
        "description": "this is just a test description",
        "invitecode": "40442",
        "numberofgroups": 52
      }
      """;

      when(ctx.bodyValidator(OpenHunt.class))
          .then(value -> new BodyValidator<OpenHunt>(testNewOpenHunt2, OpenHunt.class, javalinJackson));

      assertThrows(ValidationException.class, () -> {
        openHuntController.addNewOpenHunt(ctx);
      });
}

}







