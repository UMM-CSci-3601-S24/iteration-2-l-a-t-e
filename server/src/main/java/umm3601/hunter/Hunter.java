package umm3601.hunter;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({ "VisibilityModifier" })
public class Hunter {

  @ObjectId
  @Id

  @SuppressWarnings({ "MemberName" })
  public String _id;

  public String hunterName;


  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Hunter)) {
      return false;
    }
    Hunter other = (Hunter) obj;
    return _id.equals(other._id);
  }

  @Override
  public int hashCode() {
    return _id.hashCode();

  }
}
