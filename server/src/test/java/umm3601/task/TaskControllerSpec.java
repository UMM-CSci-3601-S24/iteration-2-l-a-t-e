package umm3601.task;

// import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertNotEquals;
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
// import org.eclipse.jetty.util.IO;
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
// import io.javalin.validation.BodyValidator;
// import io.javalin.validation.ValidationException;

/**
 * Tests the logic of the TaskController
 *
 * @throws IOException
 *
 */
@SuppressWarnings({"MagicNumber"})
class TaskControllerSpec {

  // An instance of the controller we're testing that is prepared in
  // `setupEach()`, and then exercised in the various tests below.
  private TaskController taskController;

  // A Mongo object ID that is initialized in `setupEach()` and used in few of tests
  private ObjectId kkTaskId;

  // The client and database that will be used
  // for al the tests in this spec file.
  private static MongoClient mongoClient;
  private static MongoDatabase db;

  // Used to translate between JSON and POJOs.
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Task>> taskArrayListCaptor;

  @Captor
  private ArgumentCaptor<Task> taskCaptor;

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
    MongoCollection<Document> taskDocuments = db.getCollection("tasks");
    taskDocuments.drop();
    List<Document> testTasks = new ArrayList<>();
    testTasks.add(
      new Document()
          .append("huntid", "1234567")
          .append("description", "teamAkaHunt"));

    testTasks.add(
      new Document()
          .append("huntid", "1234567")
          .append("description", "for event test"));

    testTasks.add(
      new Document()
          .append("huntid", "1234567")
          .append("description", "for even test 2"));

    kkTaskId = new ObjectId();
    Document kk = new Document()
        .append("_id", kkTaskId)
        .append("huntid", "1234567")
        .append("description", "This is test task for KK");

    taskDocuments.insertMany(testTasks);
    taskDocuments.insertOne(kk);

    taskController = new TaskController(db);
  }
 /**
  * Test for addRoutes method in TaskController.
  */
  @Test // Still failed
  void addRoutes() {
    Javalin mockServer = mock(Javalin.class);
    taskController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(2)).get(any(), any());
    // verify(mockServer, Mockito.atLeastOnce()).post(any(), any());
    // verify(mockServer, Mockito.atLeastOnce()).delete(any(), any());
  }

  /**
   * Test for getTask() in TaskController with ExistentId.
   */
  @Test
  void canGetTaskWithExistentId() throws IOException {
    String id = kkTaskId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    taskController.getTask(ctx);

    verify(ctx).json(taskCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals("This is test task for KK", taskCaptor.getValue().description);
    assertEquals(kkTaskId.toHexString(), taskCaptor.getValue()._id);
  }

  /**
   * Test for getTask() in TaskController with bad Id.
   * This will throw an exception message.
   */
  @Test
  void getTaskWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      taskController.getTask(ctx);
    });

    assertEquals("The requested task id wasn't a legal Mongo Object ID.", exception.getMessage());
  }

  /**
   * Test for getTask() in TaskController with NonexistentId.
   * This will throw an exception message.
   */
  @Test
  void getTaskWithNonexistentId() throws IOException {
    String id = "280820042908200427082004";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      taskController.getTask(ctx);
    });

    assertEquals("The requested task was not found", exception.getMessage());
  }

  /**
   * Test for getAllTasks() in TaskController.
   */
  @Test
  void canGetAllTasks() throws IOException {
    // When something asks the (mocked) context for the queryParamMap,
    // it will return an empty map (since there are no query params in
    // this case where we want all tasks).
    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());

    // Ask the taskController to getTasks
    // (which will ask the context for its queryParamMap)
    taskController.getAllTasks(ctx);

    verify(ctx).json(taskArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Check that the database collection holds the same number of documents
    // as the size of the captured List<Task>
    assertEquals(
        db.getCollection("tasks").countDocuments(),
        taskArrayListCaptor.getValue().size());
  }

  /**
   * Test for filter getTasksByHuntid
   */

   @Test
  void canGetTasksWithHunt() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(TaskController.TASK_KEY, Arrays.asList(new String[] {"1234567"}));
    queryParams.put(TaskController.SORT_ORDER_KEY, Arrays.asList(new String[] {"desc"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(TaskController.TASK_KEY)).thenReturn("1234567");
    when(ctx.queryParam(TaskController.SORT_ORDER_KEY)).thenReturn("desc");

    taskController.getAllTasks(ctx);

    verify(ctx).json(taskArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Confirm that all the users passed to `json` work for OHMNET.
    for (Task task : taskArrayListCaptor.getValue()) {
      assertEquals("1234567", task.huntid);
    }
  }

  // /**
  //  * Test for filter getHuntsByTitle
  //  */
  // @Test
  // void canGetHuntsWithTitle() throws IOException {
  //   Map<String, List<String>> queryParams = new HashMap<>();
  //   queryParams.put(HuntController.TITLE_KEY, Arrays.asList(new String[] {"KKTestHunt"}));
  //   queryParams.put(HuntController.SORT_ORDER_KEY, Arrays.asList(new String[] {"desc"}));
  //   when(ctx.queryParamMap()).thenReturn(queryParams);
  //   when(ctx.queryParam(HuntController.TITLE_KEY)).thenReturn("KKTestHunt");
  //   when(ctx.queryParam(HuntController.SORT_ORDER_KEY)).thenReturn("desc");

  //   huntController.getAllHunts(ctx);

  //   verify(ctx).json(huntArrayListCaptor.capture());
  //   verify(ctx).status(HttpStatus.OK);

  //   // Confirm that all the users passed to `json` work for OHMNET.
  //   for (Hunt hunt : huntArrayListCaptor.getValue()) {
  //     assertEquals("KKTestHunt", hunt.title);
  //   }
  // }

  // /**
  //  * Test for filter getHuntsByDescription
  //  */
  // @Test
  // void canGetHuntsWithDescription() throws IOException {
  //   Map<String, List<String>> queryParams = new HashMap<>();
  //   queryParams.put(HuntController.DESCRIPTION_KEY, Arrays.asList(new String[] {"This is test hunt for KK"}));
  //   queryParams.put(HuntController.SORT_ORDER_KEY, Arrays.asList(new String[] {"desc"}));
  //   when(ctx.queryParamMap()).thenReturn(queryParams);
  //   when(ctx.queryParam(HuntController.DESCRIPTION_KEY)).thenReturn("This is test hunt for KK");
  //   when(ctx.queryParam(HuntController.SORT_ORDER_KEY)).thenReturn("desc");

  //   huntController.getAllHunts(ctx);

  //   verify(ctx).json(huntArrayListCaptor.capture());
  //   verify(ctx).status(HttpStatus.OK);

  //   // Confirm that all the users passed to `json` work for OHMNET.
  //   for (Hunt hunt : huntArrayListCaptor.getValue()) {
  //     assertEquals("This is test hunt for KK", hunt.description);
  //   }
  // }
}
