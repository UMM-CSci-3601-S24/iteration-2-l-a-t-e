package umm3601.hunt;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.util.ArrayList;

import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;

public class HuntController implements Controller {

  private static final String API_HUNTS = "/api/hunts";
  private static final String API_HUNTS_BY_ID = "/api/hunts/{id}";

  static final String TITLE_KEY = "title";
  static final String DESCRIPTION_KEY = "description";
  static final String TASK_KEY = "tasks";

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
    hunt = huntCollection.find(eq("_id", new ObjectId(.id))).first();

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

  // Set the JSON body of the response to be the list of users returned by the database.
  // According to the Javalin documentation (https://javalin.io/documentation#context),
  // this calls result(jsonString), and also sets content type to json
  ctx.json(matchingHunts);

  // Explicitly set the context status to OK
  ctx.status(HttpStatus.OK);
}
}
