import fetch from 'isomorphic-fetch'
import 'url-search-params-polyfill'

class JobsApi {
  static getAllJobs(token, queryParams={}) {
    let searchParams = new URLSearchParams()
    Object.keys(queryParams).forEach(function (key) {
      let param = queryParams[key]
      searchParams.append(key, param)
    })

    const url = `http://localhost:8000/jobs/?${searchParams.toString()}`
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

  static updateJob(job, token) {
    const request = new Request(`http://localhost:8000/jobs/${job.id}/`, {
      method: 'PUT',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(job)
    })


    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static createJob(job, token) {
    const request = new Request('http://localhost:8000/jobs/', {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(job)
    })


    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static deleteJob(job) {
    const request = new Request(`http://localhost:8000/jobs/${job.id}`, {
      method: 'DELETE'
    })

    return fetch(request).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }
}

export default JobsApi
