import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";
import expect from "expect";
import {
  fetchBusinessesRequest,
  FETCH_BUSINESSES,
  fetchBusinesses,
  FETCH_BUSINESSES_SUCCESS
} from "./businesses";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockResponse = (status, statusText, response) => {
  return new window.Response(response, {
    status: status,
    statusText: statusText,
    headers: {
      "Content-type": "application/json"
    }
  });
};

describe("business actions", () => {
  it("should create an action to fetch businesses", () => {
    const expectedAction = {
      type: FETCH_BUSINESSES
    };
    expect(fetchBusinessesRequest()).toEqual(expectedAction);
  });
});

describe("business async actions", () => {

  it("creates FETCH_BUSINESSES_SUCCESS when fetching businesses has been done", () => {
    fetchMock.get("*", {
      count: 1,
      next: null,
      previous: null,
      results: [{ id: 1, name: "idealrent", timezone: "Europe/Copenhagen" }]
    });

    const expectedActions = [
      { type: FETCH_BUSINESSES },
      {
        type: FETCH_BUSINESSES_SUCCESS,
        meta: {
          count: 1,
          next: null,
          previous: null
        },
        payload: {
          entities: {
            businesses: {
              1: {
                id: 1,
                name: "idealrent",
                timezone: "Europe/Copenhagen"
              }
            }
          },
          result: [1]
        }
      }
    ];
    const store = mockStore({ businesses: [] });

    return store.dispatch(fetchBusinesses("abc")).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    fetchMock.restore();
  });
});
