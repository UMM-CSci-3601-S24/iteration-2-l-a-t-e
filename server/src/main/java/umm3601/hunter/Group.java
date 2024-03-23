package umm3601.hunter;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({ "VisibilityModifier" })
public class Group {

  @ObjectId
  @Id

  @SuppressWarnings({ "MemberName" })
  public String _id;

  public String groupName;
  public String[] huntIds;
  public Hunter[] hunters; //this is meant to be empty in the database, it will be populated with Hunter objects when it is sent to frontend


  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Group)) {
      return false;
    }
    Group other = (Group) obj;
    return _id.equals(other._id);
  }

  @Override
  public int hashCode() {
    return _id.hashCode();

  }
}

