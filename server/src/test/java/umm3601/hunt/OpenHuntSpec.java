package umm3601.hunt;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class OpenHuntSpec {

  private static final String FAKE_ID_STRING_1 = "fakeIdOne";
  private static final String FAKE_ID_STRING_2 = "fakeIdTwo";

  private OpenHunt hunt1;
  private OpenHunt hunt2;

  @BeforeEach
  void setupEach() {
    hunt1 = new OpenHunt();
    hunt2 = new OpenHunt();
  }

  @Test
  void huntsWithEqualIdAreEqual() {
    hunt1._id = FAKE_ID_STRING_1;
    hunt2._id = FAKE_ID_STRING_1;

    assertTrue(hunt1.equals(hunt2));
  }

  @Test
  void huntsWithDifferentIdAreNotEqual() {
    hunt1._id = FAKE_ID_STRING_1;
    hunt2._id = FAKE_ID_STRING_2;

    assertFalse(hunt1.equals(hunt2));
  }

  @Test
  void hashCodesAreBasedOnId() {
    hunt1._id = FAKE_ID_STRING_1;
    hunt2._id = FAKE_ID_STRING_1;

    assertTrue(hunt1.hashCode() == hunt2.hashCode());
  }

  @SuppressWarnings("unlikely-arg-type")
  @Test
  void huntsAreNotEqualToOtherKindsOfThings() {
    hunt1._id = FAKE_ID_STRING_1;
    // a hunt is not equal to its id even though id is used for checking equality
    assertFalse(hunt1.equals(FAKE_ID_STRING_1));
  }

}
