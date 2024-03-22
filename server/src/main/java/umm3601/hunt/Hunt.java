package umm3601.hunt;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({ "VisibilityModifier" })
public class Hunt {

  @ObjectId @Id

  @SuppressWarnings({ "MemberName" })
  public String _id;

  public String hostid;
  public String title;
  public String description;

  public String estimatedTime;

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Hunt)) {
      return false;
    }
    Hunt other = (Hunt) obj;
    return _id.equals(other._id);
  }

  @Override
  public int hashCode() {
    return _id.hashCode();

  }
}
