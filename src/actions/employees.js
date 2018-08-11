// @flow
import { normalize } from "normalizr";
import { addSuccess, addError } from "redux-flash-messages";
import { employeeListSchema, employeeSchema } from "../schemas";
import type { Dispatch, ThunkAction } from "../types/Store";
import employeesApi from "../api";

//Create new employee
export const CREATE_EMPLOYEE: "CREATE_EMPLOYEE" = "CREATE_EMPLOYEE";
export const CREATE_EMPLOYEE_SUCCESS: "CREATE_EMPLOYEE_SUCCESS" =
  "CREATE_EMPLOYEE_SUCCESS";
export const CREATE_EMPLOYEE_FAILURE: "CREATE_EMPLOYEE_FAILURE" =
  "CREATE_EMPLOYEE_FAILURE";

//Fetch employees
export const FETCH_EMPLOYEES: "FETCH_EMPLOYEES" = "FETCH_EMPLOYEES";
export const FETCH_EMPLOYEES_SUCCESS: "FETCH_EMPLOYEES_SUCCESS" =
  "FETCH_EMPLOYEES_SUCCESS";
export const FETCH_EMPLOYEES_FAILURE: "FETCH_EMPLOYEES_FAILURE" =
  "FETCH_EMPLOYEES_FAILURE";

export const FETCH_EMPLOYEE: "FETCH_EMPLOYEE" = "FETCH_EMPLOYEE";
export const FETCH_EMPLOYEE_SUCCESS: "FETCH_EMPLOYEE_SUCCESS" =
  "FETCH_EMPLOYEE_SUCCESS";
export const FETCH_EMPLOYEE_FAILURE: "FETCH_EMPLOYEE_FAILURE" =
  "FETCH_EMPLOYEE_FAILURE";

//Update employee
export const UPDATE_EMPLOYEE: "UPDATE_EMPLOYEE" = "UPDATE_EMPLOYEE";
export const UPDATE_EMPLOYEE_SUCCESS: "UPDATE_EMPLOYEE_SUCCESS" =
  "UPDATE_EMPLOYEE_SUCCESS";
export const UPDATE_EMPLOYEE_FAILURE: "UPDATE_EMPLOYEE_FAILURE" =
  "UPDATE_EMPLOYEE_FAILURE";

//Delete employee
export const DELETE_EMPLOYEE: "DELETE_EMPLOYEE" = "DELETE_EMPLOYEE";
export const DELETE_EMPLOYEE_SUCCESS: "DELETE_EMPLOYEE_SUCCESS" =
  "DELETE_EMPLOYEE_SUCCESS";
export const DELETE_EMPLOYEE_FAILURE: "DELETE_EMPLOYEE_FAILURE" =
  "DELETE_EMPLOYEE_FAILURE";

export type Employee = {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  businesses: Array<number>
};

export type EmployeesMap = { [id: number]: Employee };

export type EmployeesResponse = {
  results: Array<Employee>,
  count: number,
  next: ?string,
  previous: ?string
};

type FetchEmployeesAction = {
  type: typeof FETCH_EMPLOYEES
};

type FetchEmployeesSuccessAction = {
  type: typeof FETCH_EMPLOYEES_SUCCESS,
  payload: { entities: { employees: EmployeesMap }, result: Array<number> },
  meta: { count: number, next: ?string, previous: ?string }
};

type FetchEmployeesFailureAction = {
  type: typeof FETCH_EMPLOYEES_FAILURE,
  error: string
};

type FetchEmployeeAction = {
  type: typeof FETCH_EMPLOYEE
};

type FetchEmployeeSuccessAction = {
  type: typeof FETCH_EMPLOYEE_SUCCESS,
  payload: { entities: { employees: EmployeesMap }, result: number }
};

type FetchEmployeeFailureAction = {
  type: typeof FETCH_EMPLOYEE_FAILURE,
  error: string
};

type CreateEmployeeAction = {
  type: typeof CREATE_EMPLOYEE,
  payload: Employee
};

type CreateEmployeeSuccessAction = {
  type: typeof CREATE_EMPLOYEE_SUCCESS,
  payload: { entities: { employees: EmployeesMap }, result: number }
};

type CreateEmployeeFailureAction = {
  type: typeof CREATE_EMPLOYEE_FAILURE,
  payload: Employee,
  error: string
};

type UpdateEmployeeAction = {
  type: typeof UPDATE_EMPLOYEE,
  payload: Employee
};

type UpdateEmployeeSuccessAction = {
  type: typeof UPDATE_EMPLOYEE_SUCCESS,
  payload: { entities: { employees: EmployeesMap }, result: number }
};

type UpdateEmployeeFailureAction = {
  type: typeof UPDATE_EMPLOYEE_FAILURE,
  payload: Employee,
  error: string
};

type DeleteEmployeeAction = {
  type: typeof DELETE_EMPLOYEE,
  payload: Employee
};

type DeleteEmployeeSuccessAction = {
  type: typeof DELETE_EMPLOYEE_SUCCESS,
  payload: Employee
};

type DeleteEmployeeFailureAction = {
  type: typeof DELETE_EMPLOYEE_FAILURE,
  payload: Employee,
  error: string
};

export type Action =
  | FetchEmployeesAction
  | FetchEmployeesSuccessAction
  | FetchEmployeesFailureAction
  | FetchEmployeeAction
  | FetchEmployeeSuccessAction
  | FetchEmployeeFailureAction
  | CreateEmployeeAction
  | CreateEmployeeSuccessAction
  | CreateEmployeeFailureAction
  | UpdateEmployeeAction
  | UpdateEmployeeSuccessAction
  | UpdateEmployeeFailureAction
  | DeleteEmployeeAction
  | DeleteEmployeeSuccessAction
  | DeleteEmployeeFailureAction;

export const fetchEmployeesRequest = (): FetchEmployeesAction => {
  return {
    type: FETCH_EMPLOYEES
  };
};

export const fetchEmployeesSuccess = (
  response: EmployeesResponse
): FetchEmployeesSuccessAction => {
  return {
    type: FETCH_EMPLOYEES_SUCCESS,
    payload: normalize(response.results, employeeListSchema),
    meta: {
      count: response.count,
      next: response.next,
      previous: response.previous
    },
    receivedAt: Date.now()
  };
};

export const fetchEmployeesFailure = (
  error: string
): FetchEmployeesFailureAction => {
  return {
    type: FETCH_EMPLOYEES_FAILURE,
    error: error
  };
};

export const fetchEmployees = (
  token: string,
  queryParams: Object = {}
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchEmployeesRequest());

    return employeesApi
      .getAll("users", token, queryParams)
      .then((responseEmployees: EmployeesResponse) => {
        dispatch(fetchEmployeesSuccess(responseEmployees));
        return responseEmployees;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const fetchEmployeeRequest = (): FetchEmployeeAction => {
  return {
    type: FETCH_EMPLOYEE
  };
};

export const fetchEmployeeSuccess = (
  payload: Employee
): FetchEmployeeSuccessAction => {
  return {
    type: FETCH_EMPLOYEE_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, employeeSchema)
  };
};

export const fetchEmployeeFailure = (
  error: string
): FetchEmployeeFailureAction => {
  return {
    type: FETCH_EMPLOYEE_FAILURE,
    error: error
  };
};

export const fetchEmployee = (token: string, id: number): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchEmployeesRequest());

    return employeesApi
      .getOne("users", id, token)
      .then((responseEmployee: Employee) => {
        dispatch(fetchEmployeeSuccess(responseEmployee));
        return responseEmployee;
      })
      .catch((error: string) => {
        dispatch(fetchEmployeesFailure("error"));
      });
  };
};

export const createEmployeeRequest = (
  payload: Employee
): CreateEmployeeAction => {
  return {
    type: CREATE_EMPLOYEE,
    payload
  };
};

export const createEmployeeSuccess = (
  payload: Employee
): CreateEmployeeSuccessAction => {
  return {
    type: CREATE_EMPLOYEE_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, employeeSchema)
  };
};

export const createEmployeeError = (
  payload: Employee,
  error: string
): CreateEmployeeFailureAction => {
  return {
    type: CREATE_EMPLOYEE_FAILURE,
    error,
    payload
  };
};

export const createEmployee = (
  employee: Employee,
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(createEmployeeRequest(employee));

    return employeesApi
      .create("users", employee, token)
      .then((responseEmployee: Employee) => {
        dispatch(createEmployeeSuccess(responseEmployee));
        addSuccess({
          text: "Saved"
        });
        return responseEmployee;
      })
      .catch((error: string) => {
        dispatch(createEmployeeError(employee, error));
        addError({
          text: "An error occurred"
        });
      });
  };
};

export const updateEmployeeRequest = (
  payload: Employee
): UpdateEmployeeAction => {
  return {
    type: UPDATE_EMPLOYEE,
    payload
  };
};

export const updateEmployeeSuccess = (
  payload: Employee
): UpdateEmployeeSuccessAction => {
  return {
    type: UPDATE_EMPLOYEE_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, employeeSchema)
  };
};

export const updateEmployeeError = (
  payload: Employee,
  error: string
): UpdateEmployeeFailureAction => {
  return {
    type: UPDATE_EMPLOYEE_FAILURE,
    error,
    payload
  };
};

export const updateEmployee = (
  employee: Employee,
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateEmployeeRequest(employee));

    return employeesApi
      .update("users", employee, token)
      .then((responseEmployee: Employee) => {
        dispatch(updateEmployeeSuccess(responseEmployee));
        addSuccess({
          text: "Saved"
        });
        return responseEmployee;
      })
      .catch((error: string) => {
        dispatch(updateEmployeeError(employee, error));
        addError({
          text: "An error occurred"
        });
      });
  };
};

export const deleteEmployeeRequest = (
  payload: Employee
): DeleteEmployeeAction => {
  return {
    type: DELETE_EMPLOYEE,
    payload
  };
};

export const deleteEmployeeSuccess = (
  payload: Employee
): DeleteEmployeeSuccessAction => {
  return {
    type: DELETE_EMPLOYEE_SUCCESS,
    receivedAt: Date.now(),
    payload
  };
};

export const deleteEmployeeError = (
  payload: Employee,
  error: string
): DeleteEmployeeFailureAction => {
  return {
    type: DELETE_EMPLOYEE_FAILURE,
    error,
    payload
  };
};

export const deleteEmployee = (
  employee: Employee,
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(deleteEmployeeRequest(employee));

    return employeesApi
      .delete("users", employee, token)
      .then(() => {
        dispatch(deleteEmployeeSuccess(employee));
        addSuccess({
          text: "Deleted"
        });
      })
      .catch((error: string) => {
        dispatch(deleteEmployeeError(employee, error));
        addError({
          text: "An error occurred"
        });
      });
  };
};
