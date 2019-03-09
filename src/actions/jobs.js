// @flow
import { merge } from "lodash/object";
import moment from "moment";
import { normalize } from "normalizr";
import { addSuccess, addError } from "redux-flash-messages";
import { jobListSchema, jobSchema } from "../schemas";
import jobsApi from "../api";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { Business } from "../actions/businesses";
import type { Property } from "../actions/properties";
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

//Delete job
export const DELETE_JOB: "DELETE_JOB" = "DELETE_JOB";
export const DELETE_JOB_SUCCESS: "DELETE_JOB_SUCCESS" = "DELETE_JOB_SUCCESS";
export const DELETE_JOB_FAILURE: "DELETE_JOB_FAILURE" = "DELETE_JOB_FAILURE";

export type Job = {
  id: number,
  client: number,
  client_firstname: string,
  client_lastname: string,
  business: number,
  recurrences: string,
  title: string,
  description: string,
  line_items: [Object],
  begins: Date,
  ends: ?Date,
  start_time: Date,
  finish_time: Date,
  anytime: boolean,
  closed: boolean,
  schedule_visits_task: ?number,
  invoice_reminder: string,
  incomplete_visit_count: number,
  completed_visit_count: number
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
  payload: {
    entities: {
      properties: { [id: number]: Property },
      jobs: { [id: number]: Job }
    },
    result: number
  }
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
  payload: { entities: Job, result: number }
};

type UpdateJobFailureAction = {
  type: typeof UPDATE_JOB_FAILURE,
  error: string
};

type DeleteJobAction = {
  type: typeof DELETE_JOB,
  payload: Job
};

type DeleteJobSuccessAction = {
  type: typeof DELETE_JOB_SUCCESS,
  payload: Job
};

type DeleteJobFailureAction = {
  type: typeof DELETE_JOB_FAILURE,
  payload: Job,
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
  | UpdateJobFailureAction
  | DeleteJobAction
  | DeleteJobSuccessAction
  | DeleteJobFailureAction;

const parse = (job): Job => {
  return merge({}, job, {
    begins: job.begins && new Date(job.begins),
    ends: job.ends && new Date(job.ends),
    start_time: job.start_time && moment(job.start_time, "HH:mm"),
    finish_time: job.finish_time && moment(job.finish_time, "HH:mm")
  });
};

const serialize = (job: Job) => {
  return merge({}, job, {
    begins: job.begins && moment(job.begins).format("YYYY-MM-DD"),
    ends: job.ends && moment(job.ends).format("YYYY-MM-DD"),
    start_time:
      job.start_time && moment(job.start_time, "h:mm a").format("HH:mm"),
    finish_time:
      job.finish_time && moment(job.finish_time, "h:mm a").format("HH:mm")
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
        dispatch(fetchJobsFailure(error));
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
        addSuccess({
          text: "Saved"
        });
        return coercedJob;
      })
      .catch((error: string) => {
        dispatch(createJobError(error));
        addError({
          text: "An error occurred"
        });
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
        dispatch({ type: "RESET_VISITS" });
        history.push(`/${job.business}/jobs/${job.id}`);
        addSuccess({
          text: "Saved"
        });
        return coercedJob;
      })
      .catch((error: string) => {
        dispatch(updateJobError(error));
        addError({
          text: "An error occurred"
        });
      });
  };
};

export const partialUpdateJob = (
  job: { id: number },
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateJobRequest(job));

    return jobsApi
      .update("jobs", job, token, true)
      .then((responseJob: Job) => {
        const coercedJob = parse(responseJob);
        dispatch(updateJobSuccess(coercedJob));
        addSuccess({
          text: "Saved"
        });
        return coercedJob;
      })
      .catch((error: string) => {
        dispatch(updateJobError(error));
        addError({
          text: "An error occurred"
        });
      });
  };
};

export const deleteJobRequest = (payload: Job): DeleteJobAction => {
  return {
    type: DELETE_JOB,
    payload
  };
};

export const deleteJobSuccess = (payload: Job): DeleteJobSuccessAction => {
  return {
    type: DELETE_JOB_SUCCESS,
    payload
  };
};

export const deleteJobError = (
  payload: Job,
  error: string
): DeleteJobFailureAction => {
  return {
    type: DELETE_JOB_FAILURE,
    error,
    payload
  };
};

export const deleteJob = (job: Job, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(deleteJobRequest(job));

    return jobsApi
      .delete("jobs", job, token)
      .then(() => {
        dispatch(deleteJobSuccess(job));
        history.push(`/${job.business}/jobs`);
        addSuccess({
          text: "Deleted"
        });
      })
      .catch((error: string) => {
        dispatch(deleteJobError(job, error));
        addError({
          text: "An error occurred"
        });
      });
  };
};
