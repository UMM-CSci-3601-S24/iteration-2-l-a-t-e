package umm3601.hunter;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class HunterSpec {

  private static final String FAKE_ID_STRING_1 = "fakeIdOne";
  private static final String FAKE_ID_STRING_2 = "fakeIdTwo";

  private Hunter hunter1;
  private Hunter hunter2;

  @BeforeEach
  void setupEach() {
    hunter1 = new Hunter();
    hunter2 = new Hunter();
  }

  @Test
  void huntersWithEqualIdAreEqual() {
    hunter1._id = FAKE_ID_STRING_1;
    hunter2._id = FAKE_ID_STRING_1;

    assertTrue(hunter1.equals(hunter2));
  }

  @Test
  void huntersWithDifferentIdAreNotEqual() {
    hunter1._id = FAKE_ID_STRING_1;
    hunter2._id = FAKE_ID_STRING_2;

    assertFalse(hunter1.equals(hunter2));
  }

  @Test
  void hashCodesAreBasedOnId() {
    hunter1._id = FAKE_ID_STRING_1;
    hunter2._id = FAKE_ID_STRING_1;

    assertTrue(hunter1.hashCode() == hunter2.hashCode());
  }

  @SuppressWarnings("unlikely-arg-type")
  @Test
  void huntersAreNotEqualToOtherKindsOfThings() {
    hunter1._id = FAKE_ID_STRING_1;
    // a hunter is not equal to its id even though id is used for checking equality
    assertFalse(hunter1.equals(FAKE_ID_STRING_1));
  }

}
