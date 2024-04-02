package umm3601.hunt;

// import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
// import static com.mongodb.client.model.Filters.regex;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
// import java.util.List;
import java.util.Map;
// import java.util.Objects;
// import java.util.regex.Pattern;

// import org.bson.BsonObjectId;
// import org.bson.BsonValue;
import org.bson.Document;
import org.bson.UuidRepresentation;
// import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
// import com.mongodb.client.model.Sorts;
// import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.InsertOneResult;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;
import umm3601.hunter.Group;
import umm3601.hunter.Hunter;
// import io.javalin.validation.ValidationException;



public class OpenHuntController implements Controller {

  private static final String API_NEW_OPENHUNTS = "/api/openhunts/new";
  //this is the actual open hunt id
  private static final String API_OPENHUNTS_BY_ID = "/api/openhunts/{id}";

  private static final String API_OPENHUNTS = "/api/openhunts";
  //this is the open hunt id, not the hunter id
  private static final String API_NEW_HUNTER_BY_OPENHUNT_ID = "/api/openhunts/hunter/{id}";
  //this is the group id
  private static final String API_GROUP_BY_ID = "/api/openhunts/group/{id}";
  //this is the invite code and returns the bare openhunt/ hunt without group json
  private static final String API_OPENHUNTS_BY_INVITE_CODE = "/api/openhunts/invite/{invitecode}";

  static final String INVITE_CODE_KEY = "invitecode";

  private final JacksonMongoCollection<OpenHunt> openHuntCollection;
  private final JacksonMongoCollection<Group> groupCollection;
  private final JacksonMongoCollection<Hunter> hunterCollection;

  public OpenHuntController(MongoDatabase database) {
    openHuntCollection = JacksonMongoCollection.builder().build(
    database,
    "openHunts",
    OpenHunt.class,
    UuidRepresentation.STANDARD);

    groupCollection = JacksonMongoCollection.builder().build(
      database,
      "groups",
      Group.class,
      UuidRepresentation.STANDARD);

    hunterCollection = JacksonMongoCollection.builder().build(
       database,
       "hunters",
       Hunter.class,
       UuidRepresentation.STANDARD);
  }
  public void getAllOpenHunts(Context ctx) {
    List<OpenHunt> openHunts;
    ArrayList<Hunter> hunterArrayList = new ArrayList<Hunter>();

    try {
        openHunts = openHuntCollection.find().into(new ArrayList<>());
        for (OpenHunt openHunt : openHunts) {
            openHunt.groups = new Group[openHunt.numberofgroups];
            int i = 0;
            for (String groupId : openHunt.groupids) {
                Group nextGroup = this.getGroupById(groupId);
                if (nextGroup.hunterIds != null) {
                    for (String hunterId : nextGroup.hunterIds) {
                        Hunter nextHunter = hunterCollection.find(eq("_id", new ObjectId(hunterId))).first();
                        hunterArrayList.add(nextHunter);
                    }
                }
                openHunt.groups[i] = nextGroup;
                openHunt.groups[i].hunters = hunterArrayList.toArray(new Hunter[hunterArrayList.size()]);
                i++;
            }
        }
    } catch (IllegalArgumentException e) {
        throw new BadRequestResponse("An illegal argument was encountered while fetching open hunts.");
    }

    ctx.json(openHunts);
    ctx.status(HttpStatus.OK);
}

  // //gets the bare open hunt without the group json and the hunter json
  // public void getOpenHuntByInviteCode(Context ctx) {
  //   String code = ctx.pathParam("invitecode");
  //   System.err.println("Getting open hunt with invite code " + code);
  //   OpenHunt openHunt;

  //   openHunt = openHuntCollection.find(eq(INVITE_CODE_KEY, code)).first();

  //   if (openHunt == null) {
  //     throw new NotFoundResponse("The requested invite code was not found " + code);
  //   } else {
  //     ctx.json(openHunt);
  //     ctx.status(HttpStatus.OK);
  //   }
  // }


  public void getOpenHunt(Context ctx) {
    String id = ctx.pathParam("id");
    OpenHunt openHunt;
    int i = 0;
    ArrayList<Hunter> hunterArrayList = new ArrayList<Hunter>();

    try {
      openHunt = openHuntCollection.find(eq("_id", new ObjectId(id))).first();
      if (openHunt != null) {
      openHunt.groups = new Group[openHunt.numberofgroups];
      for (String groupId : openHunt.groupids) {
        Group nextGroup = groupCollection.find(eq("_id", new ObjectId(groupId))).first();
        if (nextGroup.hunterIds != null) {
        for (String hunterId : nextGroup.hunterIds) {
          Hunter nextHunter = hunterCollection.find(eq("_id", new ObjectId(hunterId))).first();
          hunterArrayList.add(nextHunter);
        }
      }
        openHunt.groups[i] = nextGroup;
        openHunt.groups[i].hunters = hunterArrayList.toArray(new Hunter[hunterArrayList.size()]);
        i++;
      }
    }

    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested open hunt id wasn't a legal Mongo Object ID.");
    }
    if (openHunt == null) {
      throw new NotFoundResponse("The requested openHunt was not found");
    } else {
      ctx.json(openHunt);
      ctx.status(HttpStatus.OK);
    }
  }

  public void getOpenHuntbyInviteCode(Context ctx) {
    String inviteCode = ctx.pathParam("inviteCode");
    OpenHunt openHunt;
    int i = 0;
    ArrayList<Hunter> hunterArrayList = new ArrayList<>();

        openHunt = openHuntCollection.find(eq("invitecode", inviteCode)).first();
        if (openHunt != null) {
            openHunt.groups = new Group[openHunt.numberofgroups];
            for (String groupId : openHunt.groupids) {
                Group nextGroup = groupCollection.find(eq("_id", new ObjectId(groupId))).first();
                if (nextGroup.hunterIds != null) {
                    for (String hunterId : nextGroup.hunterIds) {
                        Hunter nextHunter = hunterCollection.find(eq("_id", new ObjectId(hunterId))).first();
                        hunterArrayList.add(nextHunter);
                    }
                }
                openHunt.groups[i] = nextGroup;
                openHunt.groups[i].hunters = hunterArrayList.toArray(new Hunter[hunterArrayList.size()]);
                i++;
            }
        }


    if (openHunt == null) {
        throw new NotFoundResponse("The requested invite code was not found " + inviteCode);
    } else {
        ctx.json(openHunt);
        ctx.status(HttpStatus.OK);
    }
}


  public void addNewOpenHunt(Context ctx) {
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
      final int maxGroupNumber = 51;
      OpenHunt newOpenHunt = ctx.bodyValidator(OpenHunt.class)
      .check(hnt -> hnt.title != null, "Hunt must have non-empty title")
      .check(hnt -> hnt.title.length() > 2, "Hunt must not have title shorter than 2 characters")
      .check(hnt -> hnt.description != null, "Hunt must have non-empty description")
      .check(hnt -> hnt.description.length() > 2, "Hunt must not have description shorter than 2 characters")
      .check(hnt -> hnt.active, "Hunt must be open/active to begin with")
      .check(hnt -> hnt.numberofgroups > 0 && hnt.numberofgroups < maxGroupNumber,
       "Hunt must have a positive number of groups that is less than 51")
      .get();
      int numGroups = newOpenHunt.numberofgroups;
      newOpenHunt.groupids = new String[numGroups];

      for (int i = 1; i <= numGroups; i++) {
        Group newGroup = new Group();
        newGroup.groupName = "Group" + Integer.toString(i);
        InsertOneResult groupResult = groupCollection.insertOne(newGroup);
        String id = groupResult.getInsertedId().asObjectId().getValue().toString();
        newOpenHunt.groupids[i - 1] = id;
      }
    // Add new hunt to the database.
    openHuntCollection.insertOne(newOpenHunt);

    // Set the JSON response to be the `_id` of the newly created hunt.
    // This gives the client the opportunity to know the ID of the new hunt,
    // which it can then use to perform further operation.
    ctx.json(Map.of("id", newOpenHunt._id));

    // 201 (`HttpStatus.CREATED`) is the HTTP code for when we
    // successfully create a new resource ( a hunt ).
    ctx.status(HttpStatus.CREATED);
  }

  public void addNewHunter(Context ctx) { //need to update this new hunterid string into the group it goes into
    String id = ctx.pathParam("id");
    System.err.println("The id is " + id);
    Hunter newHunter;

    System.out.println("id in method: " + id + " ctx body: " + ctx.body());

    newHunter = ctx.bodyValidator(Hunter.class)
        .check(hunter -> hunter.hunterName != null, "Hunter must have non-empty name")
        .check(hunter -> hunter.hunterName.length() > 2, "Hunter must not have name shorter than 2 characters")
        .get();


    System.err.println("got hunter object " + newHunter.hunterName);

    String groupId = chooseGroup(id);

    System.err.println("group id: " + groupId);

    InsertOneResult hunterResult = hunterCollection.insertOne(newHunter);
    String hunterId = hunterResult.getInsertedId().asObjectId().getValue().toString();

     System.out.println("hunter id in method: " + hunterId);
     System.out.println("group id in method: " + groupId);

    Group group = getGroupById(groupId);
    System.out.println("group retrieved");
    System.out.println("group in method: " + group);
    Document groupDoc = new Document();
    Document updateDoc;
    System.out.println("hunter list creating");
    ArrayList<String> hunterIdArrayList;
      if (group.hunterIds != null) {
        hunterIdArrayList = new ArrayList<String>(Arrays.asList(group.hunterIds)); }
      else {
      hunterIdArrayList = new ArrayList<String>(); }
      hunterIdArrayList.add(hunterId);
      System.out.println("hunter added retrieved");
      //need to append array list instead of array or else it causes an error
      groupDoc.append("hunterIds", hunterIdArrayList);
    System.out.println("groupId: " + groupId + " group name: " + group.groupName);
    // ArrayList<Document> hunterDocs = new ArrayList<>();
    // if(group.hunters != null) {
    //     for(Hunter hunter : Arrays.asList(group.hunters)) {
    //         Document hunterDoc = new Document("id", hunter._id)
    //                                       .append("name", hunter.hunterName);
    //         hunterDocs.add(hunterDoc);
    //     }
    // }
    // Add the newHunter converted to Document
    // Document newHunterDoc = new Document("id", newHunter._id)
    //                .append("hunterName", newHunter.hunterName);
    // hunterDocs.add(newHunterDoc);

    // Use hunterDocs instead of hunterList for appending
    // groupDoc.append("hunters", hunterDocs);


    updateDoc = new Document("$set", groupDoc);
    groupCollection.updateOne(eq("_id", new ObjectId(groupId)), updateDoc);

    ctx.json(Map.of("id", group._id)); //returns group id for further routing use in frontend

    ctx.status(HttpStatus.CREATED);
  }

  @SuppressWarnings({ "MagicNumber" })
  private String chooseGroup(String openHuntId) {
    OpenHunt openHunt;
    int minimumGroup = 10000;
    String minimumGroupId = null;


    try {
      openHunt = openHuntCollection.find(eq("_id", new ObjectId(openHuntId))).first();
      System.err.println("openHunt name: " + openHunt.title);
      if (openHunt != null) {
      for (String groupId : openHunt.groupids) {
        Group nextGroup = groupCollection.find(eq("_id", new ObjectId(groupId))).first();
        System.err.println("groupName: " + nextGroup.groupName);
        int groupSize;
        if (nextGroup.hunterIds == null) {
          groupSize = 0; }
        else {
          System.err.println("hunterids:" + nextGroup.hunterIds.toString());
          groupSize = nextGroup.hunterIds.length;
          System.err.println("groupName: " + nextGroup.groupName + "group size :" + groupSize);
        }
        if (groupSize < minimumGroup) {
          minimumGroup = groupSize;
          minimumGroupId = nextGroup._id;
          System.err.println("minimum group name " + nextGroup.groupName);
        }
      }
    }
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested hunt id wasn't a legal Mongo Object ID.");
    }
    if (openHunt == null) {
      throw new NotFoundResponse("The requested openHunt was not found");
    } else {
      return (minimumGroupId);
    }
  }

  private Group getGroupById(String groupId) {
    // Check if groupId is null or empty
    if (groupId == null || groupId.trim().isEmpty()) {
        throw new BadRequestResponse("The provided group ID is empty or null.");
    }

    try {
        // Attempt to retrieve the group from the database
        Group group = groupCollection.find(eq("_id", new ObjectId(groupId))).first();
        System.out.println("group in method: " + group);

        // If no group is found, throw a NotFoundResponse
        if (group == null) {
            System.out.println("No group found with ID: " + groupId); // Logging for debugging
            throw new NotFoundResponse("The requested group was not found");
        }

        // Return the found group
        return group;

    } catch (IllegalArgumentException e) {
        // This catches cases where groupId is not a valid ObjectId format
        System.out.println("IllegalArgumentException for groupId: " + groupId); // Logging for debugging
        throw new BadRequestResponse("The requested group id wasn't a legal Mongo Object ID.");
    }
}


  public void getGroup(Context ctx) {
    String id = ctx.pathParam("id");
    System.out.println("group attempted");
    Group group = getGroupById(id);
    System.out.println("group retrieved");
    ArrayList<Hunter> hunterArrayList = new ArrayList<Hunter>();

    if (group.hunterIds != null) {
    for (String hunterId : group.hunterIds) {
      Hunter nextHunter = hunterCollection.find(eq("_id", new ObjectId(hunterId))).first();
      hunterArrayList.add(nextHunter);
    }
    group.hunters = hunterArrayList.toArray(new Hunter[hunterArrayList.size()]);
  }
    ctx.json(group);
    ctx.status(HttpStatus.OK);
  }

  public void addRoutes(Javalin server) {
    // get the specified group
    server.get(API_GROUP_BY_ID, this::getGroup);
    // get the specified OpenHunt
    server.get(API_OPENHUNTS_BY_ID, this::getOpenHunt);

    server.get(API_OPENHUNTS, this::getAllOpenHunts);
    // List hunts, filtered using query parameters
    server.post(API_NEW_OPENHUNTS, this::addNewOpenHunt);
    //add new hunter, returns group id hunter is in
    server.post(API_NEW_HUNTER_BY_OPENHUNT_ID, this::addNewHunter);
    // //get bare openhunt by invite code
    // server.get(API_OPENHUNTS_BY_INVITE_CODE, this::getOpenHuntByInviteCode);
  }

}
