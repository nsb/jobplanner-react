import fetch from 'isomorphic-fetch'

class ClientsApi {
  static getAllClients(token) {
    const request = new Request('http://localhost:8000/clients/', {
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

  static updateClient(client) {
    const request = new Request(`http://localhost:8000/clients/${client.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({client: client})
    })


    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static createClient(client, token) {
    const request = new Request('http://localhost:8000/clients/', {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(client)
    })


    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static deleteCat(cat) {
    const request = new Request(`http://localhost:8000/api/v1/Clients/${cat.id}`, {
      method: 'DELETE'
    })

    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }
}

export default ClientsApi
