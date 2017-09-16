import reducer from "./businesses";
import { FETCH_BUSINESSES } from "../actions/businesses";

describe("businesses reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      isFetching: true,
      hasLoaded: false,
      count: 0,
      next: null,
      result: []
    });
  });

  it("should handle FETCH_BUSINESSES", () => {
    expect(
      reducer(undefined, {
        type: FETCH_BUSINESSES
      })
    ).toEqual({
      isFetching: true,
      hasLoaded: false,
      count: 0,
      next: null,
      result: []
    });
  });
});
