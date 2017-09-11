// @flow
import { merge } from "lodash/object";
import { normalize } from "normalizr";
import { jobListSchema, jobSchema } from "../schemas";
import jobsApi from "../api";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { Business } from "../actions/businesses";
import history from "../history";

//Create new job
export const CREATE_JOB: "CREATE_JOB" = "CREATE_JOB";
export const CREATE_JOB_SUCCESS: "CREATE_JOB_SUCCESS" = "CREATE_JOB_SUCCESS";
export const CREATE_JOB_FAILURE: "CREATE_JOB_FAILURE" = "CREATE_JOB_FAILURE";
export const RESET_NEW_JOB: "RESET_NEW_JOB" = "RESET_NEW_JOB";

//Fetch jobs
export const FETCH_JOBS: "FETCH_JOBS" = "FETCH_JOBS";
export const FETCH_JOBS_SUCCESS: "FETCH_JOBS_SUCCESS" = "FETCH_JOBS_SUCCESS";
export const FETCH_JOBS_FAILURE: "FETCH_JOBS_FAILURE" = "FETCH_JOBS_FAILURE";
export const RESET_JOBS: "RESET_JOBS" = "RESET_JOBS";

//Fetch job
export const FETCH_JOB: "FETCH_JOB" = "FETCH_JOB";
export const FETCH_JOB_SUCCESS: "FETCH_JOB_SUCCESS" = "FETCH_JOB_SUCCESS";
export const FETCH_JOB_FAILURE: "FETCH_JOB_FAILURE" = "FETCH_JOB_FAILURE";

//Update jobs
export const UPDATE_JOB: "UPDATE_JOB" = "UPDATE_JOB";
export const UPDATE_JOB_SUCCESS: "UPDATE_JOB_SUCCESS" = "UPDATE_JOB_SUCCESS";
export const UPDATE_JOB_FAILURE: "UPDATE_JOB_FAILURE" = "UPDATE_JOB_FAILURE";

export type Job = {
  id: number,
  client: number,
  business: number,
  recurrences: string,
  description: string,
  line_items: [Object],
  begins: Date,
  ends: Date,
  anytime: boolean,
  closed: boolean
};

export type JobsMap = { [id: number]: Job };

export type JobsResponse = {
  results: Array<Job>,
  count: number,
  next: ?string,
  previous: ?string
};

type FetchJobsAction = {
  type: typeof FETCH_JOBS
};

type FetchJobsSuccessAction = {
  type: typeof FETCH_JOBS_SUCCESS,
  payload: { entities: { jobs: JobsMap }, result: Array<number> },
  meta: { count: number, next: ?string, previous: ?string }
};

type FetchJobsFailureAction = {
  type: typeof FETCH_JOBS_FAILURE,
  error: string
};

type CreateJobAction = {
  type: typeof CREATE_JOB,
  payload: Job
};

type CreateJobSuccessAction = {
  type: typeof CREATE_JOB_SUCCESS,
  payload: { entities: { jobs: JobsMap }, result: number }
};

type CreateJobFailureAction = {
  type: typeof CREATE_JOB_FAILURE,
  error: string
};

type FetchJobAction = {
  type: typeof FETCH_JOB
};

type FetchJobSuccessAction = {
  type: typeof FETCH_JOB_SUCCESS,
  payload: Job
};

type FetchJobFailureAction = {
  type: typeof FETCH_JOB_FAILURE,
  error: string
};

type UpdateJobAction = {
  type: typeof UPDATE_JOB,
  payload: Job | { id: number }
};

type UpdateJobSuccessAction = {
  type: typeof UPDATE_JOB_SUCCESS,
  payload: Job
};

type UpdateJobFailureAction = {
  type: typeof UPDATE_JOB_FAILURE,
  error: string
};

export type Action =
  | FetchJobsAction
  | FetchJobsSuccessAction
  | FetchJobsFailureAction
  | CreateJobAction
  | CreateJobSuccessAction
  | CreateJobFailureAction
  | FetchJobAction
  | FetchJobSuccessAction
  | FetchJobFailureAction
  | UpdateJobAction
  | UpdateJobSuccessAction
  | UpdateJobFailureAction;

const parse = (job): Job => {
  return merge({}, job, {
    begins: new Date(job.begins),
    ends: new Date(job.ends)
  });
};

const serialize = (job: Job) => {
  return merge({}, job, {
    begins: job.begins && job.begins.toISOString(),
    ends: job.ends && job.ends.toISOString()
  });
};

export const fetchJobsRequest = (): FetchJobsAction => {
  return {
    type: FETCH_JOBS
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

export const fetchJobsSuccess = (
  response: JobsResponse
): FetchJobsSuccessAction => {
  return {
    type: FETCH_JOBS_SUCCESS,
    payload: normalize(response.results, jobListSchema),
    meta: {
      count: response.count,
      next: response.next,
      previous: response.previous
    },
    receivedAt: Date.now()
  };
};

export const fetchJobsFailure = (error: string): FetchJobsFailureAction => {
  return {
    type: FETCH_JOBS_FAILURE,
    error: error
  };
};

export const fetchJobs = (
  token: string,
  queryParams: Object = {}
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchJobsRequest());

    return jobsApi
      .getAll("jobs", token, queryParams)
      .then((responseJobs: JobsResponse) => {
        const coercedJobs = merge({}, responseJobs, {
          results: responseJobs.results.map(parse)
        });
        dispatch(fetchJobsSuccess(coercedJobs));
        return coercedJobs;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const createJobRequest = (payload: Job): CreateJobAction => {
  return {
    type: CREATE_JOB,
    payload
  };
};

export const createJobSuccess = (payload: Job): CreateJobSuccessAction => {
  return {
    type: CREATE_JOB_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, jobSchema)
  };
};

export const createJobError = (error: string): CreateJobFailureAction => {
  return {
    type: CREATE_JOB_FAILURE,
    error
  };
};

export const createJob = (
  business: Business,
  job: Job,
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(createJobRequest(job));

    return jobsApi
      .create("jobs", serialize(job), token)
      .then((responseJob: Job) => {
        const coercedJob = parse(responseJob);
        dispatch(createJobSuccess(coercedJob));
        history.push(`/${business.id}/jobs/${responseJob.id}`);
        return coercedJob;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const fetchJobRequest = (): FetchJobAction => {
  return {
    type: FETCH_JOB
  };
};

export const fetchJobSuccess = (payload: Job): FetchJobSuccessAction => {
  return {
    type: FETCH_JOB_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, jobSchema)
  };
};

export const fetchJobFailure = (error: string): FetchJobFailureAction => {
  return {
    type: FETCH_JOB_FAILURE,
    error: error
  };
};

export const fetchJob = (token: string, id: number): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchJobRequest());

    return jobsApi
      .getOne("jobs", id, token)
      .then((responseJob: Job) => {
        const coercedJob = parse(responseJob);
        dispatch(fetchJobSuccess(coercedJob));
        return coercedJob;
      })
      .catch((error: string) => {
        dispatch(fetchJobFailure(error));
      });
  };
};

export const updateJobRequest = (
  payload: Job | { id: number }
): UpdateJobAction => {
  return {
    type: UPDATE_JOB,
    payload
  };
};

export const updateJobSuccess = (payload: Job): UpdateJobSuccessAction => {
  return {
    type: UPDATE_JOB_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, jobSchema)
  };
};

export const updateJobError = (error: string): UpdateJobFailureAction => {
  return {
    type: UPDATE_JOB_FAILURE,
    error
  };
};

export const updateJob = (job: Job, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateJobRequest(job));

    return jobsApi
      .update("jobs", serialize(job), token)
      .then((responseJob: Job) => {
        const coercedJob = parse(responseJob);
        dispatch(updateJobSuccess(coercedJob));
        history.push(`/${job.business}/jobs/${job.id}`);
        return coercedJob;
      })
      .catch((error: string) => {
        dispatch(updateJobError(error));
      });
  };
};

export const partialUpdateJob = (
  job: { id: number },
  token: string,
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateJobRequest(job));

    return jobsApi
      .update("jobs", job, token, true)
      .then((responseJob: Job) => {
        const coercedJob = parse(responseJob);
        dispatch(updateJobSuccess(coercedJob));
        return coercedJob;
      })
      .catch((error: string) => {
        dispatch(updateJobError(error));
      });
  };
};
