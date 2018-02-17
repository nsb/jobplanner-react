// @flow
import fetch from "isomorphic-fetch";
import Api from "./index";

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

class UsersApi extends Api {
  static getMe(token: string): Promise<*> {
    const request = new Request(`${API_ENDPOINT}/users/me/`, {
      method: "GET",
      headers: new Headers({
        Authorization: `Jwt ${token}`,
        "Content-Type": "application/json"
      })
    });

    return fetch(request)
      .then(response => {
        return response.json();
      })
      .catch((error: string) => {
        throw error;
      });
  }
}

export default UsersApi;
