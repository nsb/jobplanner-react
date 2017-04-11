// @flow
import fetch from 'isomorphic-fetch'
import 'url-search-params-polyfill'

class Api {
  static getAll(resource: string, token: string, queryParams: Object={}): Promise<*> {
    let searchParams: URLSearchParams = new URLSearchParams()
    Object.keys(queryParams).forEach(function (key) {
      let param: string = queryParams[key]
      searchParams.append(key, param)
    })

    const url: string = `http://localhost:8000/${resource}/?${searchParams.toString()}`
    const request = new Request(url, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    })

    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static update(resource: string, item: { id: number }, token: string) {
    const request = new Request(`http://localhost:8000/${resource}/${item.id}/`, {
      method: 'PUT',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(item)
    })


    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static create(resource: string, item: {}, token: string) {
    const request = new Request(`http://localhost:8000/${resource}/`, {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(item)
    })


    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static delete(resource: string, item: { id: number }, token: string) {
    const request = new Request(`http://localhost:8000/${resource}/${item.id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
    })

    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }
}

export default Api
