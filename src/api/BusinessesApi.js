import fetch from 'isomorphic-fetch'

class BusinessesApi {
  static getAllBusinesses(token) {
    const request = new Request('http://localhost:8000/businesses/', {
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

  static updateBusiness(business) {
    const request = new Request(`http://localhost:8000/businesses/${business.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(business)
    })


    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static createBusiness(business, token) {
    const request = new Request('http://localhost:8000/businesses/', {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(business)
    })


    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static deleteBusiness(business) {
    const request = new Request(`http://localhost:8000/businesses/${business.id}`, {
      method: 'DELETE'
    })

    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }
}

export default BusinessesApi
