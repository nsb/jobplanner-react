// @flow
import {normalize} from 'normalizr';
import {jobListSchema, jobSchema} from '../schemas';
import jobsApi from '../api';
import type {Dispatch} from '../types/Store';
import type {Business} from '../actions/businesses';
import history from '../history';

//Create new job
export const CREATE_JOB: 'CREATE_JOB' = 'CREATE_JOB';
export const CREATE_JOB_SUCCESS: 'CREATE_JOB_SUCCESS' = 'CREATE_JOB_SUCCESS';
export const CREATE_JOB_FAILURE: 'CREATE_JOB_FAILURE' = 'CREATE_JOB_FAILURE';
export const RESET_NEW_JOB: 'RESET_NEW_JOB' = 'RESET_NEW_JOB';

//Fetch jobs
export const FETCH_JOBS: 'FETCH_JOBS' = 'FETCH_JOBS';
export const FETCH_JOBS_SUCCESS: 'FETCH_JOBS_SUCCESS' = 'FETCH_JOBS_SUCCESS';
export const FETCH_JOBS_FAILURE: 'FETCH_JOBS_FAILURE' = 'FETCH_JOBS_FAILURE';
export const RESET_JOBS: 'RESET_JOBS' = 'RESET_JOBS';

//Update jobs
export const UPDATE_JOB: 'UPDATE_JOB' = 'UPDATE_JOB';
export const UPDATE_JOB_SUCCESS: 'UPDATE_JOB_SUCCESS' = 'UPDATE_JOB_SUCCESS';
export const UPDATE_JOB_FAILURE: 'UPDATE_JOB_FAILURE' = 'UPDATE_JOB_FAILURE';

export type Job = {
  id: number,
  client: number,
  recurrences: string,
  description: string,
  line_items: [Object],
};

export type JobsMap = {[id: number]: Job};

type FetchJobsAction = {
  type: typeof FETCH_JOBS,
};

type FetchJobsSuccessAction = {
  type: typeof FETCH_JOBS_SUCCESS,
  payload: {entities: {jobs: JobsMap}, result: Array<number>},
};

type FetchJobsFailureAction = {
  type: typeof FETCH_JOBS_FAILURE,
  error: string,
};

type CreateJobAction = {
  type: typeof CREATE_JOB,
  payload: Job,
};

type CreateJobSuccessAction = {
  type: typeof CREATE_JOB_SUCCESS,
  payload: Job,
};

type CreateJobFailureAction = {
  type: typeof CREATE_JOB_FAILURE,
  error: string,
};

type UpdateJobAction = {
  type: typeof UPDATE_JOB,
  payload: Job,
};

type UpdateJobSuccessAction = {
  type: typeof UPDATE_JOB_SUCCESS,
  payload: Job,
};

type UpdateJobFailureAction = {
  type: typeof UPDATE_JOB_FAILURE,
  error: string,
};

export type Action =
  | FetchJobsAction
  | FetchJobsSuccessAction
  | FetchJobsFailureAction
  | CreateJobAction
  | CreateJobSuccessAction
  | CreateJobFailureAction
  | UpdateJobAction
  | UpdateJobSuccessAction
  | UpdateJobFailureAction;

export const fetchJobsRequest = (): FetchJobsAction => {
  return {
    type: FETCH_JOBS,
  };
};

// interface ErrorResponse<S,T> {
//   status: S,
//   statusText: T,
// }
//
// interface JSONResponse<S,J> {
//   status: S,
//   json(): Promise<J>,
// }
//
// type JobsJSON = [Job]
// type DecrementResponse = ErrorResponse<400,string>
//                        | JSONResponse<200,JobsJSON>

export const fetchJobsSuccess = (jobs: Array<Job>): FetchJobsSuccessAction => {
  return {
    type: FETCH_JOBS_SUCCESS,
    payload: normalize(jobs, jobListSchema),
    receivedAt: Date.now(),
  };
};

export const fetchJobsFailure = (error: string): FetchJobsFailureAction => {
  return {
    type: FETCH_JOBS_FAILURE,
    error: error,
  };
};

export const fetchJobs = (token: string, queryParams: Object = {}) => {
  return (dispatch: Dispatch) => {
    dispatch(fetchJobsRequest());

    return jobsApi
      .getAll('jobs', token, queryParams)
      .then((responseJobs: Array<Job>) => {
        if (Array.isArray(responseJobs)) {
          dispatch(fetchJobsSuccess(responseJobs));
        } else {
          dispatch(fetchJobsFailure('error'));
        }
        return responseJobs;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const createJobRequest = (payload: Job): CreateJobAction => {
  return {
    type: CREATE_JOB,
    payload,
  };
};

export const createJobSuccess = (payload: Job): CreateJobSuccessAction => {
  return {
    type: CREATE_JOB_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, jobSchema),
  };
};

export const createJobError = (error: string): CreateJobFailureAction => {
  return {
    type: CREATE_JOB_FAILURE,
    error,
  };
};

export const createJob = (business: Business, job: Job, token: string) => {
  return (dispatch: Dispatch) => {
    dispatch(createJobRequest(job));

    return jobsApi
      .create('jobs', job, token)
      .then((responseJob: Job) => {
        dispatch(createJobSuccess(responseJob));
        history.push(`/${business.id}/jobs/${responseJob.id}`)
        return responseJob;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const updateJobRequest = (payload: Job): UpdateJobAction => {
  return {
    type: UPDATE_JOB,
    payload,
  };
};

export const updateJobSuccess = (payload: Job): UpdateJobSuccessAction => {
  return {
    type: UPDATE_JOB_SUCCESS,
    receivedAt: Date.now(),
    payload,
  };
};

export const updateJobError = (error: string): UpdateJobFailureAction => {
  return {
    type: UPDATE_JOB_FAILURE,
    error,
  };
};

export const updateJob = (job: Job, token: string) => {
  return (dispatch: Dispatch) => {
    dispatch(updateJobRequest(job));

    return jobsApi
      .update('jobs', job, token)
      .then((responseJob: Job) => {
        dispatch(updateJobSuccess(responseJob));
        return responseJob;
      })
      .catch((error: string) => {
        dispatch(updateJobError(error));
      });
  };
};
