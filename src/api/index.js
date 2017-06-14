// @flow
import fetch from 'isomorphic-fetch';
import 'url-search-params-polyfill';

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

class Api {
  static getAll(
    resource: string,
    token: string,
    queryParams: {[key: string]: string} = {}
  ): Promise<*> {
    let searchParams: URLSearchParams = new URLSearchParams();
    Object.keys(queryParams).forEach(function(key) {
      let param = queryParams[key];
      searchParams.append(key, param);
    });

    const url: string = `${API_ENDPOINT}/${resource}/?${searchParams.toString()}`;
    const request = new Request(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    });

    return fetch(request)
      .then(response => {
        return response.json();
      })
      .catch((error: string) => {
        return error;
      });
  }

  static getOne(
    resource: string,
    id: number,
    token: string,
  ): Promise<*> {

    const url: string = `${API_ENDPOINT}/${resource}/${id}/`;
    const request = new Request(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    });

    return fetch(request)
      .then(response => {
        return response.json();
      })
      .catch((error: string) => {
        return error;
      });
  }

  static update(resource: string, item: {id: number}, token: string) {
    const request = new Request(`${API_ENDPOINT}/${resource}/${item.id}/`, {
      method: 'PUT',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(item),
    });

    return fetch(request)
      .then(response => {
        return response.json();
      })
      .catch((error: string) => {
        throw error;
      });
  }

  static create(resource: string, item: {}, token: string) {
    const request = new Request(`${API_ENDPOINT}/${resource}/`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(item),
    });

    return fetch(request)
      .then(response => {
        return response.json();
      })
      .catch((error: string) => {
        throw error;
      });
  }

  static delete(resource: string, item: {id: number}, token: string) {
    const request = new Request(`${API_ENDPOINT}/${resource}/${item.id}`, {
      method: 'DELETE',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
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

export default Api;
