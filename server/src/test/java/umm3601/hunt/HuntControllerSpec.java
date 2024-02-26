package umm3601.hunt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

/**
 * Tests the logic of the HuntController
 *
 * @throws IOException
 *
 */
@SuppressWarnings({"MagicNumber"})
class HuntControllerSpec {

  // An instance of the controller we're testing that is prepared in
  // `setupEach()`, and then exercised in the various tests below.
  private HuntController huntController;

  // A Mongo object ID that is initialized in `setupEach()` and used in few of tests
  private ObjectId kkHuntId;

  // The client and database that will be used
  // for al the tests in this spec file.
  private static MongoClient mongoClient;
  private static MongoDatabase db;

  // Used to translate between JSON and POJOs.
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Hunt>> huntArrayListCaptor;

  @Captor
  private ArgumentCaptor<Hunt> huntCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  /**
   * Sets up (the connection to the) DB once; that connection and DB will
   * then be (re)used for all the tests, and closed in the `teardown()`
   * method.
   *
   *  It's somewhat expensive to establish a connection to the
   * database, and there are usually limits to how many connections
   * a database will support at once. Limiting ourselves to a single
   * connection that will be shared across all the tests in this spec
   * file helps both speed things up and reduce the load on the DB
   * engine.
   *
   */

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
    // anotations @Mock and @Captor).
    MockitoAnnotations.openMocks(this);

    // Setup Database
    MongoCollection<Document> huntDocuments = db.getCollection("hunts");
    huntDocuments.drop();
    List<Document> testHunts = new ArrayList<>();
    testHunts.add(
      new Document()
          .append("hostid", "1234567")
          .append("title", "CSCI3601Hunt")
          .append("description", "teamAkaHunt"));

    testHunts.add(
      new Document()
          .append("hostid", "1234567")
          .append("title", "KKHunt")
          .append("description", "for event test"));

    testHunts.add(
      new Document()
          .append("hostid", "1234567")
          .append("title", "NicHunt")
          .append("description", "for even test 2"));

    kkHuntId = new ObjectId();
    Document kk = new Document()
        .append("_id", kkHuntId)
        .append("hostid", "1234567")
        .append("title", "KKTestHunt")
        .append("description", "This is test hunt for KK");

    huntDocuments.insertMany(testHunts);
    huntDocuments.insertOne(kk);

    huntController = new HuntController(db);
  }
 /**
  * Test for addRoutes method in HuntController.
  */
  @Test // Still failed
  void addRoutes() {
    Javalin mockServer = mock(Javalin.class);
    huntController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(2)).get(any(), any());
    // verify(mockServer, Mockito.atLeastOnce()).post(any(), any());
    // verify(mockServer, Mockito.atLeastOnce()).delete(any(), any());
  }

  /**
   * Test for getHunt() in HuntController with ExistentId.
   */
  @Test
  void canGetHuntWithExistentId() throws IOException {
    String id = kkHuntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    huntController.getHunt(ctx);

    verify(ctx).json(huntCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals("KKTestHunt", huntCaptor.getValue().title);
    assertEquals(kkHuntId.toHexString(), huntCaptor.getValue()._id);
  }

  /**
   * Test for getHunt() in HuntController with bad Id.
   * This will throw an exception message.
   */
  @Test
  void getUserWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      huntController.getHunt(ctx);
    });

    assertEquals("The requested hunt id wasn't a legal Mongo Object ID.", exception.getMessage());
  }

  /**
   * Test for getHunt() in HuntController with NonexistentId.
   * This will throw an exception message.
   */
  @Test
  void getHuntWithNonexistentId() throws IOException {
    String id = "280820042908200427082004";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      huntController.getHunt(ctx);
    });

    assertEquals("The requested hunt was not found", exception.getMessage());
  }

  /**
   * Test for getAllHunts() in HuntController.
   */
  @Test // Still failed
  void canGetAllHunts() throws IOException {
    // When something asks the (mocked) context for the queryParamMap,
    // it will return an empty map (since there are no query params in
    // this case where we want all hunts).
    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());

    // Ask the huntController to getHunts
    // (which will ask the context for its queryParamMap)
    huntController.getAllHunts(ctx);

    verify(ctx).json(huntArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Check that the database collection holds the same number of documents
    // as the size of the captured List<Hunt>
    assertEquals(
        db.getCollection("hunts").countDocuments(),
        huntArrayListCaptor.getValue().size());
  }

  /**
   * Test for filter getHuntsByHost
   */
   @Test
  void canGetHuntsWithHost() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(HuntController.HOST_KEY, Arrays.asList(new String[] {"1234567"}));
    queryParams.put(HuntController.SORT_ORDER_KEY, Arrays.asList(new String[] {"desc"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(HuntController.HOST_KEY)).thenReturn("1234567");
    when(ctx.queryParam(HuntController.SORT_ORDER_KEY)).thenReturn("desc");

    huntController.getAllHunts(ctx);

    verify(ctx).json(huntArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Confirm that all the users passed to `json` work for OHMNET.
    for (Hunt hunt : huntArrayListCaptor.getValue()) {
      assertEquals("1234567", hunt.hostid);
    }
  }

  /**
   * Test for filter getHuntsByTitle
   */
  @Test
  void canGetHuntsWithTitle() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(HuntController.TITLE_KEY, Arrays.asList(new String[] {"KKTestHunt"}));
    queryParams.put(HuntController.SORT_ORDER_KEY, Arrays.asList(new String[] {"desc"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(HuntController.TITLE_KEY)).thenReturn("KKTestHunt");
    when(ctx.queryParam(HuntController.SORT_ORDER_KEY)).thenReturn("desc");

    huntController.getAllHunts(ctx);

    verify(ctx).json(huntArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Confirm that all the users passed to `json` work for OHMNET.
    for (Hunt hunt : huntArrayListCaptor.getValue()) {
      assertEquals("KKTestHunt", hunt.title);
    }
  }

  /**
   * Test for filter getHuntsByDescription
   */
  @Test
  void canGetHuntsWithDescription() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(HuntController.DESCRIPTION_KEY, Arrays.asList(new String[] {"This is test hunt for KK"}));
    queryParams.put(HuntController.SORT_ORDER_KEY, Arrays.asList(new String[] {"desc"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(HuntController.DESCRIPTION_KEY)).thenReturn("This is test hunt for KK");
    when(ctx.queryParam(HuntController.SORT_ORDER_KEY)).thenReturn("desc");

    huntController.getAllHunts(ctx);

    verify(ctx).json(huntArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Confirm that all the users passed to `json` work for OHMNET.
    for (Hunt hunt : huntArrayListCaptor.getValue()) {
      assertEquals("This is test hunt for KK", hunt.description);
    }
  }
}
