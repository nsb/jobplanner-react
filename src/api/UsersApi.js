import fetch from 'isomorphic-fetch'

class UsersApi {
  static getAllUsers(token) {
    const request = new Request('http://localhost:8000/users/', {
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

  static getMe(token) {
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

  static updateUser(user) {
    const request = new Request(`http://localhost:8000/users/${user.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(user)
    })


    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static createUser(user, token) {
    const request = new Request('http://localhost:8000/users/', {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(user)
    })


    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static deleteUser(user) {
    const request = new Request(`http://localhost:8000/users/${user.id}`, {
      method: 'DELETE'
    })

    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }
}

export default UsersApi
