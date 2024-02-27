package umm3601.hunt;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

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

// Might not needed.
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
  Bson combinedFilter = constructFilter(ctx); // Not sure if needed.
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

// Not sure if needed.

/**
 * @param ctx
 * @return
 *
 */

 private Bson constructFilter(Context ctx) {
  List<Bson> filters = new ArrayList<>();
  // starts with an empty list of filer.

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

    // get the specified Hunt
    server.get(API_HUNTS_BY_ID, this::getHunt);
    // List hunts, filtered using query parameters
    server.get(API_HUNTS, this::getAllHunts);
  }

}
