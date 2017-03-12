import { normalize } from 'normalizr'
import { jobListSchema } from '../schemas'
import jobsApi from '../api/JobsApi'

//Create new job
export const CREATE_JOB = 'CREATE_JOB'
export const CREATE_JOB_SUCCESS = 'CREATE_JOB_SUCCESS'
export const CREATE_JOB_FAILURE = 'CREATE_JOB_FAILURE'
export const RESET_NEW_JOB = 'RESET_NEW_JOB'

//Fetch jobs
export const FETCH_JOBS = 'FETCH_JOBS'
export const FETCH_JOBS_SUCCESS = 'FETCH_JOBS_SUCCESS'
export const FETCH_JOBS_FAILURE = 'FETCH_JOBS_FAILURE'
export const RESET_JOBS = 'RESET_JOBS'

export const fetchJobsRequest = () => {
  return {
    type: FETCH_JOBS
  }
}

export const fetchJobsSuccess = (jobs) => {
  return {
    type: FETCH_JOBS_SUCCESS,
    payload: normalize(jobs, jobListSchema),
    receivedAt: Date.now()
  }
}

export const fetchJobsFailure = (error) => {
  return {
    type: FETCH_JOBS_FAILURE,
    error: error
  }
}

export const fetchJobs = (token, queryParams = {}) => {

  return (dispatch) => {

    dispatch(fetchJobsRequest())

    return jobsApi.getAllJobs(token, queryParams).then(responseJobs => {
      if (Array.isArray(responseJobs)) {
        dispatch(fetchJobsSuccess(responseJobs))
      } else {
        dispatch(fetchJobsFailure(responseJobs))
      }
      return responseJobs
    }).catch(error => {
      throw(error)
    })
  }
}


export const createJobRequest = (payload) => {

  return {
    type: CREATE_JOB,
    payload
  }
}

export const createJobSuccess = (payload) => {
  return {
    type: CREATE_JOB_SUCCESS,
    receivedAt: Date.now(),
    payload
  }
}

export const createJobError = (error) => {
  return {
    type: CREATE_JOB_FAILURE,
    error: 'Oops'
  }
}


export const createJob = (job, token) => {

  return (dispatch) => {

    dispatch(createJobRequest(job))

    return jobsApi.createJob(job, token).then(responseJob => {
      if (responseJob.id) {
        dispatch(createJobSuccess(responseJob))
        // dispatch(push(`/${business.id}/jobs/${responseJob.id}`))
      }
      else {
        dispatch(createJobError(responseJob))
      }
      return responseJob
    }).catch(error => {
      throw(error)
    })
  }
}
