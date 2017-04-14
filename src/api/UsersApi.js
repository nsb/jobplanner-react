// @flow
import fetch from 'isomorphic-fetch'
import Api from './index'

class UsersApi extends Api {

  static getMe(token: string): Promise<*> {
    const request = new Request('http://localhost:8000/users/me/', {
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
}

export default UsersApi
