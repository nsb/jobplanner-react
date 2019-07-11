// @flow
import "url-search-params-polyfill";

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
const API_VERSION = process.env.REACT_APP_API_VERSION || "v1";

class Api {
  static getAll(
    resource: string,
    token: string,
    queryParams: { [key: string]: string | Date | boolean | number } = {}
  ): Promise<*> {
    let searchParams: URLSearchParams = new URLSearchParams();
    Object.keys(queryParams).forEach(function(key) {
      let param = queryParams[key];
      searchParams.append(
        key,
        param instanceof Date ? param.toISOString() : param.toString()
      );
    });

    const url: string = `${API_ENDPOINT}/${API_VERSION}/${resource}/?${searchParams.toString()}`;
    const options = {
      method: "GET",
      headers: new Headers({
        Authorization: `Jwt ${token}`,
        "Content-Type": "application/json"
      })
    };

    return fetch(url, options).then(response => {
      if (!response.ok) {
        return Promise.reject(response.json());
      }
      return response.json();
    });
  }

  static getOne(resource: string, id: number, token: string): Promise<*> {
    const url: string = `${API_ENDPOINT}/${API_VERSION}/${resource}/${id}/`;
    const request = new Request(url, {
      method: "GET",
      headers: new Headers({
        Authorization: `Jwt ${token}`,
        "Content-Type": "application/json"
      })
    });

    return fetch(request)
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response.json());
        }
        return response.json();
      })
      .catch((error: string) => {
        return Promise.reject(error);
      });
  }

  static update(
    resource: string,
    item: { id: number },
    token: string,
    patch: boolean = false
  ) {
    const request = new Request(
      `${API_ENDPOINT}/${API_VERSION}/${resource}/${item.id}/`,
      {
        method: patch ? "PATCH" : "PUT",
        headers: new Headers({
          Authorization: `Jwt ${token}`,
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(item)
      }
    );

    return fetch(request)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .catch((error: string) => {
        return Promise.reject(error);
      });
  }

  static create(resource: string, item: {} | Array<any>, token: ?string) {
    const request = new Request(`${API_ENDPOINT}/${API_VERSION}/${resource}/`, {
      method: "POST",
      headers: new Headers({
        Authorization: `Jwt ${token || ""}`,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(item)
    });

    return fetch(request)
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response.json());
        }
        return response.json();
      })
      .catch((error: string) => {
        return Promise.reject(error);
      });
  }

  static delete(resource: string, item: { id: number }, token: string) {
    const request = new Request(
      `${API_ENDPOINT}/${API_VERSION}/${resource}/${item.id}/`,
      {
        method: "DELETE",
        headers: new Headers({
          Authorization: `Jwt ${token}`,
          "Content-Type": "application/json"
        })
      }
    );

    return fetch(request)
      .then(response => {
        return response;
      })
      .catch((error: string) => {
        throw error;
      });
  }
}

export default Api;
