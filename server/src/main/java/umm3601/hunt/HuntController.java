package umm3601.hunt;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.DeleteResult;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;

public class HuntController implements Controller {

  private static final String API_HUNTS = "/api/hunts";
  private static final String API_HUNTS_BY_ID = "/api/hunts/{id}";

  static final String HOST_KEY = "hostid";
  static final String TITLE_KEY = "title";
  static final String DESCRIPTION_KEY = "description";
  static final String SORT_ORDER_KEY = "sortorder";

  private final JacksonMongoCollection<Hunt> huntCollection;

 /**
   * Construct a controller for hunts.
   *
   * @param database the database containing hunt data
   */

public HuntController(MongoDatabase database) {
  huntCollection = JacksonMongoCollection.builder().build(
  database,
  "hunts",
  Hunt.class,
  UuidRepresentation.STANDARD);
}

public void getHunt(Context ctx) {
  String id = ctx.pathParam("id");
  Hunt hunt;

  try {
    hunt = huntCollection.find(eq("_id", new ObjectId(id))).first();

  } catch (IllegalArgumentException e) {
    throw new BadRequestResponse("The requested hunt id wasn't a legal Mongo Object ID.");
  }
  if (hunt == null) {
    throw new NotFoundResponse("The requested hunt was not found");
  } else {
    ctx.json(hunt);
    ctx.status(HttpStatus.OK);
  }
}

 /**
   * Set the JSON body of the response to be a list of all the hunts returned from the database
   * that match any requested filters and ordering
   *
   * @param ctx a Javalin HTTP context
   */

public void getAllHunts(Context ctx) {
  Bson combinedFilter = constructFilter(ctx);
  Bson sortingOrder = constructSortingOrder(ctx);

  ArrayList<Hunt> matchingHunts = huntCollection
    .find(combinedFilter)
    .sort(sortingOrder)
    .into(new ArrayList<>());

  // Set the JSON body of the response to be the list of todos returned by the database.
  // According to the Javalin documentation (https://javalin.io/documentation#context),
  // this calls result(jsonString), and also sets content type to json
  ctx.json(matchingHunts);

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
  // starts with an empty list of filter.

  if (ctx.queryParamMap().containsKey(HOST_KEY)) {
    Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(HOST_KEY)), Pattern.CASE_INSENSITIVE);
    filters.add(regex(HOST_KEY, pattern));
    }

  if (ctx.queryParamMap().containsKey(TITLE_KEY)) {
    Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(TITLE_KEY)), Pattern.CASE_INSENSITIVE);
    filters.add(regex(TITLE_KEY, pattern));
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
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), "title");
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
  }

  /**
   *
   * @param server // The javalin server instance
   * @param HuntController The controller handles the hunt endpoints
   *
   */

  public void addRoutes(Javalin server) {
    server.put(API_HUNTS_BY_ID, this::updateHunt);
    // get the specified Hunt
    server.get(API_HUNTS_BY_ID, this::getHunt);
    // List hunts, filtered using query parameters
    server.get(API_HUNTS, this::getAllHunts);
    // Add new hunt with hunt info being in JSON body
    // of the HTTP request.
    server.post(API_HUNTS, this::addNewHunt);
    // Delete the specified hunt.
    server.delete(API_HUNTS_BY_ID, this::deleteHunt);
    // Update the specified hunt.

  }

  /**
   * Add a new Hunt using information from the context
   * (as long as the information being put in is "legals" to Hunt field)
   *
   * @param ctx a Javalin HTTP context that provides the hunt info
   * in the JSON body of the request.
   *
   */

  public void addNewHunt(Context ctx) {
    /**
     * Follow chain of statements uses the Javalin validator system
     * to verify that instance of `Hunt` provided in this context is
     * a legal hunt. Check following things ( in order ):
     *
     * - The hunt has a value title (not null)
     * - The hunt title is not blank
     * - The hunt has a value description (not null)
     * - The hunt description is not blank
     *
     * If any of these checks fail, the Javalin system will
     * throw a `BadRequestResponse` with an appropriate error message.
     *
     */
    Hunt newHunt = ctx.bodyValidator(Hunt.class)
      .check(hnt -> hnt.title != null, "Hunt must have non-empty title")
      .check(hnt -> hnt.title.length() > 2, "Hunt must not have title shorter than 2 characters")
      .check(hnt -> hnt.description != null, "Hunt must have non-empty description")
      .check(hnt -> hnt.description.length() > 2, "Hunt must not have description shorter than 2 characters")
      .get();

    // Add new hunt to the database.
    huntCollection.insertOne(newHunt);

    // Set the JSON response to be the `_id` of the newly created hunt.
    // This gives the client the opportunity to know the ID of the new hunt,
    // which it can then use to perform further operation.
    ctx.json(Map.of("id", newHunt._id));

    // 201 (`HttpStatus.CREATED`) is the HTTP code for when we
    // successfully create a new resource ( a hunt ).
    ctx.status(HttpStatus.CREATED);
  }

  /**
   * Delete a hunt by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   *
   */

  public void deleteHunt(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = huntCollection.deleteOne(eq("_id", new ObjectId(id)));
    // we should deleted 1 or 0 tasks, depend on whether `id` is a valid task ID.
    if (deleteResult.getDeletedCount() != 1) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
        "Was unable to delete ID "
          + id
          + "; perhaps illegal ID or an ID for an item not in the system?");
    }
    ctx.status(HttpStatus.OK);
  }

  /**
   * Update the hunt with the specified `id` using the
   * information provided in the request body.
   *
   * @param ctx a Javalin HTTP context
   *
   */
  public void updateHunt(Context ctx) {
    String id = ctx.pathParam("id");
    Hunt hunt = ctx.bodyValidator(Hunt.class)
      .check(hnt -> hnt.title != null, "Hunt must have non-empty title")
      .check(hnt -> hnt.title.length() > 2, "Hunt must not have title shorter than 2 characters")
      .check(hnt -> hnt.description != null, "Hunt must have non-empty description")
      .check(hnt -> hnt.description.length() > 2, "Hunt must not have description shorter than 2 characters")
      .get();

    Document huntDoc = new Document();
    huntDoc.append("title", hunt.title);
    huntDoc.append("description", hunt.description);

    Document updateDoc = new Document("$set", huntDoc);
    huntCollection.updateOne(eq("_id", new ObjectId(id)), updateDoc); //changes the specified fields in the $set command json

    ctx.status(HttpStatus.OK);
  }
}
