// @flow
import fetch from "isomorphic-fetch";
import Api from "./index";

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

class UsersApi extends Api {
  static getMe(token: string): Promise<*> {
    const request = new Request(`${API_ENDPOINT}/${API_VERSION}/users/me/`, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
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
