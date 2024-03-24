package umm3601.hunter;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class GroupSpec {

  private static final String FAKE_ID_STRING_1 = "fakeIdOne";
  private static final String FAKE_ID_STRING_2 = "fakeIdTwo";

  private Group group1;
  private Group group2;

  @BeforeEach
  void setupEach() {
    group1 = new Group();
    group2 = new Group();
  }

  @Test
  void groupsWithEqualIdAreEqual() {
    group1._id = FAKE_ID_STRING_1;
    group2._id = FAKE_ID_STRING_1;

    assertTrue(group1.equals(group2));
  }

  @Test
  void groupsWithDifferentIdAreNotEqual() {
    group1._id = FAKE_ID_STRING_1;
    group2._id = FAKE_ID_STRING_2;

    assertFalse(group1.equals(group2));
  }

  @Test
  void hashCodesAreBasedOnId() {
    group1._id = FAKE_ID_STRING_1;
    group2._id = FAKE_ID_STRING_1;

    assertTrue(group1.hashCode() == group2.hashCode());
  }

  @SuppressWarnings("unlikely-arg-type")
  @Test
  void groupsAreNotEqualToOtherKindsOfThings() {
    group1._id = FAKE_ID_STRING_1;
    // a Group is not equal to its id even though id is used for checking equality
    assertFalse(group1.equals(FAKE_ID_STRING_1));
  }

}
