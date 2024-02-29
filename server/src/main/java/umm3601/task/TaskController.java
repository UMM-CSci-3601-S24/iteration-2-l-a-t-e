package umm3601.task;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.util.ArrayList;
import java.util.List;
// import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
// import com.mongodb.client.result.DeleteResult;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;

public class TaskController implements Controller {

  private static final String API_TASKS = "/api/tasks";
  private static final String API_TASKS_BY_ID = "/api/tasks/{id}";

  static final String TASK_KEY = "huntid";
  static final String DESCRIPTION_KEY = "description";

  static final String SORT_ORDER_KEY = "sortorder";

  private final JacksonMongoCollection<Task> taskCollection;

 /**
   * Construct a controller for tasks.
   * @param database the database containing task data
   */

public TaskController(MongoDatabase database) {
  taskCollection = JacksonMongoCollection.builder().build(
  database,
  "tasks",
  Task.class,
  UuidRepresentation.STANDARD);
}

// Might not needed.
public void getTask(Context ctx) {
  String id = ctx.pathParam("id");
  Task task;

  try {
    task = taskCollection.find(eq("_id", new ObjectId(id))).first();

  } catch (IllegalArgumentException e) {
    throw new BadRequestResponse("The requested task id wasn't a legal Mongo Object ID.");
  }
  if (task == null) {
    throw new NotFoundResponse("The requested task was not found");
  } else {
    ctx.json(task);
    ctx.status(HttpStatus.OK);
  }
}

 /**
   * Set the JSON body of the response to be a list of all the hunts returned from the database
   * that match any requested filters and ordering
   *
   * @param ctx a Javalin HTTP context
   */

public void getAllTasks(Context ctx) {
  Bson combinedFilter = constructFilter(ctx);
  Bson sortingOrder = constructSortingOrder(ctx);

  ArrayList<Task> matchingTasks = taskCollection
    .find(combinedFilter)
    .sort(sortingOrder)
    .into(new ArrayList<>());

  // Set the JSON body of the response to be the list of tasks returned by the database.
  // According to the Javalin documentation (https://javalin.io/documentation#context),
  // this calls result(jsonString), and also sets content type to json
  ctx.json(matchingTasks);

  // Explicitly set the context status to OK
  ctx.status(HttpStatus.OK);
}

/**
 * @param ctx
 * @return
 *
 */

 private Bson constructFilter(Context ctx) {
  List<Bson> filters = new ArrayList<>();
  // starts with an empty list of filer.

  if (ctx.queryParamMap().containsKey(TASK_KEY)) {
    Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(TASK_KEY)), Pattern.CASE_INSENSITIVE);
    filters.add(regex(TASK_KEY, pattern));
    }

  if (ctx.queryParamMap().containsKey(DESCRIPTION_KEY)) {
  Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(DESCRIPTION_KEY)), Pattern.CASE_INSENSITIVE);
  filters.add(regex(DESCRIPTION_KEY, pattern));
    }

  // Combine list of filters into a single filtering document.
  Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

  return combinedFilter;
  }

  /**
   *
   * @param ctx
   * @return
   *
   */

   private Bson constructSortingOrder(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), "huntid");
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
  }

  /**
   *
   * @param server // The javalin server instance
   * @param TaskController The controller handles the hunt endpoints
   *
   */

  public void addRoutes(Javalin server) {

    // get the specified Hunt
    server.get(API_TASKS_BY_ID, this::getTask);
    // List hunts, filtered using query parameters
    server.get(API_TASKS, this::getAllTasks);
    // Add new hunt with hunt info being in JSON body
    // of the HTTP request.
    // server.post(API_HUNTS, this::addNewHunt);
    // Delete the specified hunt.
    // server.delete(API_HUNTS_BY_ID, this::deleteHunt);
  }

}

