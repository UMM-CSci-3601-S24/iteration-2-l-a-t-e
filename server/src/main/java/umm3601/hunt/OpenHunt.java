package umm3601.hunt;

import org.mongojack.Id;
import org.mongojack.ObjectId;
import umm3601.hunter.Group;


@SuppressWarnings({ "VisibilityModifier" })
public class OpenHunt {

  @ObjectId @Id

  @SuppressWarnings({ "MemberName" })
  public String _id;

  public boolean active;
  public String hostid;
  public String huntid;
  public String title;
  public String description;
  public String invitecode;
  public Integer numberofgroups;

  public String[] groupids;
  public Group[] groups; //this is meant to be empty in the database,
  // it will be populated with Hunter objects when it is sent to frontend

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof OpenHunt)) {
      return false;
    }
    OpenHunt other = (OpenHunt) obj;
    return _id.equals(other._id);
  }

  @Override
  public int hashCode() {
    return _id.hashCode();

  }
}
