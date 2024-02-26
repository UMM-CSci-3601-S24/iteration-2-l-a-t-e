package umm3601.hunt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
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
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
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
  private ObjectId KKhuntId;

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
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR","localhost");

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
    // aanotations @Mock and @Captor).
    MockitoAnnotations.openMocks(this);

    // Setup Database
    MongoCollection<Document> huntDocuments = db.getCollection("hunts");
    huntDocuments.drop();
    List<Document> testHunts = new ArrayList<>();
    testHunts.add(
      new Document()
          .append("hostid","1234567")
          .append("title","CSCI3601Hunt")
          .append("description","teamAkaHunt")
          .append("tasks","take picture of science building"));
    testHunts.add(
      new Document()
          .append("hostid","1234567")
          .append("title","KKHunt")
          .append("description","for event test")
          .append("tasks","take picture of library building"));
    testHunts.add(
      new Document()
          .append("hostid","1234567")
          .append("title","NicHunt")
          .append("description","for even test 2")
          .append("tasks","take picture of classroom"));

    KKhuntId = new ObjectId();
    Document KK = new Document()
        .append("_id", KKhuntId)
        .append("hostid","1234567")
        .append("title", "KKTestHunt")
        .append("description", "This is test hunt for KK")
        .append("tasks", "take picture of dining hall");

    huntDocuments.insertMany(testHunts);
    huntDocuments.insertOne(KK);

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
   * Test for getAllHunts() in HuntController.
   */
  @Test // Still failed
  void canGetAllHunts() throws IOException {
    // When something asks the (mocked) context for the queryParamMap,
    // it will return an empty map (since there are no query params in
    // this case where we want all users).
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
}
