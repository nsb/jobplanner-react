// @flow
import { normalize } from "normalizr";
import { invoiceListSchema, invoiceSchema } from "../schemas";
import type { Dispatch, ThunkAction } from "../types/Store";
import invoicesApi from "../api";

//Create new invoice
export const CREATE_INVOICE: "CREATE_INVOICE" = "CREATE_INVOICE";
export const CREATE_INVOICE_SUCCESS: "CREATE_INVOICE_SUCCESS" =
  "CREATE_INVOICE_SUCCESS";
export const CREATE_INVOICE_FAILURE: "CREATE_INVOICE_FAILURE" =
  "CREATE_INVOICE_FAILURE";

//Fetch invoices
export const FETCH_INVOICES: "FETCH_INVOICES" = "FETCH_INVOICES";
export const FETCH_INVOICES_SUCCESS: "FETCH_INVOICES_SUCCESS" =
  "FETCH_INVOICES_SUCCESS";
export const FETCH_INVOICES_FAILURE: "FETCH_INVOICES_FAILURE" =
  "FETCH_INVOICES_FAILURE";
export const RESET_INVOICES: "RESET_INVOICES" = "RESET_INVOICES";

export const FETCH_INVOICE: "FETCH_INVOICE" = "FETCH_INVOICE";
export const FETCH_INVOICE_SUCCESS: "FETCH_INVOICE_SUCCESS" =
  "FETCH_INVOICE_SUCCESS";
export const FETCH_INVOICE_FAILURE: "FETCH_INVOICE_FAILURE" =
  "FETCH_INVOICE_FAILURE";

//Update invoice
export const UPDATE_INVOICE: "UPDATE_INVOICE" = "UPDATE_INVOICE";
export const UPDATE_INVOICE_SUCCESS: "UPDATE_INVOICE_SUCCESS" =
  "UPDATE_INVOICE_SUCCESS";
export const UPDATE_INVOICE_FAILURE: "UPDATE_INVOICE_FAILURE" =
  "UPDATE_INVOICE_FAILURE";

//Delete invoice
export const DELETE_INVOICE: "DELETE_INVOICE" = "DELETE_INVOICE";
export const DELETE_INVOICE_SUCCESS: "DELETE_INVOICE_SUCCESS" =
  "DELETE_INVOICE_SUCCESS";
export const DELETE_INVOICE_FAILURE: "DELETE_INVOICE_FAILURE" =
  "DELETE_INVOICE_FAILURE";

export type Invoice = {
  id: number,
  business: number,
  visits: Array<number>,
  jobs: Array<number>,
  date: Date,
  description: string,
  client: number,
  total_ex_vat: number,
  total_inc_vat: number,
  paid: boolean,
};

export type InvoiceRequest =
  | Invoice
  | { client: number, visits: Array<number> };

export type InvoicesMap = { [id: number]: InvoiceRequest };

export type InvoicesResponse = {
  results: Array<Invoice>,
  count: number,
  next: ?string,
  previous: ?string,
};

type FetchInvoicesAction = {
  type: typeof FETCH_INVOICES,
};

type FetchInvoicesSuccessAction = {
  type: typeof FETCH_INVOICES_SUCCESS,
  payload: { entities: { invoices: InvoicesMap }, result: Array<number> },
  meta: { count: number, next: ?string, previous: ?string },
};

type FetchInvoicesFailureAction = {
  type: typeof FETCH_INVOICES_FAILURE,
  error: string,
};

type FetchInvoiceAction = {
  type: typeof FETCH_INVOICE,
};

type FetchInvoiceSuccessAction = {
  type: typeof FETCH_INVOICE_SUCCESS,
  payload: { entities: { invoices: InvoicesMap }, result: number },
};

type FetchInvoiceFailureAction = {
  type: typeof FETCH_INVOICE_FAILURE,
  error: string,
};

type CreateInvoiceAction = {
  type: typeof CREATE_INVOICE,
  payload:
    | InvoiceRequest
    | Array<Invoice>
    | Array<{ client: number, visits: Array<number> }>,
};

type CreateInvoiceSuccessAction = {
  type: typeof CREATE_INVOICE_SUCCESS,
  payload: { entities: { invoices: InvoicesMap }, result: number },
};

type CreateInvoiceFailureAction = {
  type: typeof CREATE_INVOICE_FAILURE,
  payload:
    | InvoiceRequest
    | Array<Invoice>
    | Array<{ client: number, visits: Array<number> }>,
  error: string,
};

type UpdateInvoiceAction = {
  type: typeof UPDATE_INVOICE,
  payload:
    | InvoiceRequest
    | Array<{ client: number, visits: Array<number> }>
    | { id: number },
};

type UpdateInvoiceSuccessAction = {
  type: typeof UPDATE_INVOICE_SUCCESS,
  payload: Invoice,
};

type UpdateInvoiceFailureAction = {
  type: typeof UPDATE_INVOICE_FAILURE,
  payload: Invoice | { id: number },
  error: string,
};

type DeleteInvoiceAction = {
  type: typeof DELETE_INVOICE,
  payload: Invoice,
};

type DeleteInvoiceSuccessAction = {
  type: typeof DELETE_INVOICE_SUCCESS,
  payload: Invoice,
};

type DeleteInvoiceFailureAction = {
  type: typeof DELETE_INVOICE_FAILURE,
  payload: Invoice,
  error: string,
};

type ResetInvoicesAction = {
  type: typeof RESET_INVOICES,
};

export type Action =
  | FetchInvoicesAction
  | FetchInvoicesSuccessAction
  | FetchInvoicesFailureAction
  | FetchInvoiceAction
  | FetchInvoiceSuccessAction
  | FetchInvoiceFailureAction
  | CreateInvoiceAction
  | CreateInvoiceSuccessAction
  | CreateInvoiceFailureAction
  | UpdateInvoiceAction
  | UpdateInvoiceSuccessAction
  | UpdateInvoiceFailureAction
  | DeleteInvoiceAction
  | DeleteInvoiceSuccessAction
  | DeleteInvoiceFailureAction
  | ResetInvoicesAction;

export const fetchInvoicesRequest = (): FetchInvoicesAction => {
  return {
    type: FETCH_INVOICES,
  };
};

export const fetchInvoicesSuccess = (
  response: InvoicesResponse
): FetchInvoicesSuccessAction => {
  return {
    type: FETCH_INVOICES_SUCCESS,
    payload: normalize(response.results, invoiceListSchema),
    meta: {
      count: response.count,
      next: response.next,
      previous: response.previous,
    },
    receivedAt: Date.now(),
  };
};

export const fetchInvoicesFailure = (
  error: string
): FetchInvoicesFailureAction => {
  return {
    type: FETCH_INVOICES_FAILURE,
    error: error,
  };
};

export const fetchInvoices = (
  token: string,
  queryParams: Object = {}
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchInvoicesRequest());

    return invoicesApi
      .getAll("invoices", token, queryParams)
      .then((responseInvoices: InvoicesResponse) => {
        dispatch(fetchInvoicesSuccess(responseInvoices));
        return responseInvoices;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const fetchInvoiceRequest = (): FetchInvoiceAction => {
  return {
    type: FETCH_INVOICE,
  };
};

export const fetchInvoiceSuccess = (
  payload: Invoice
): FetchInvoiceSuccessAction => {
  return {
    type: FETCH_INVOICE_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, invoiceSchema),
  };
};

export const fetchInvoiceFailure = (
  error: string
): FetchInvoiceFailureAction => {
  return {
    type: FETCH_INVOICE_FAILURE,
    error: error,
  };
};

export const fetchInvoice = (token: string, id: number): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchInvoicesRequest());

    return invoicesApi
      .getOne("invoices", id, token)
      .then((responseInvoice: Invoice) => {
        dispatch(fetchInvoiceSuccess(responseInvoice));
        return responseInvoice;
      })
      .catch((error: string) => {
        dispatch(fetchInvoicesFailure("error"));
        return error;
      });
  };
};

export const createInvoiceRequest = (
  payload:
    | InvoiceRequest
    | Array<Invoice>
    | Array<{ client: number, visits: Array<number> }>
): CreateInvoiceAction => {
  return {
    type: CREATE_INVOICE,
    payload,
  };
};

export const createInvoiceSuccess = (
  payload:
    | InvoiceRequest
    | Array<Invoice>
    | Array<{ client: number, visits: Array<number> }>
): CreateInvoiceSuccessAction => {
  return {
    type: CREATE_INVOICE_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, invoiceSchema),
  };
};

export const createInvoiceError = (
  payload:
    | InvoiceRequest
    | Array<Invoice>
    | Array<{ client: number, visits: Array<number> }>,
  error: string
): CreateInvoiceFailureAction => {
  return {
    type: CREATE_INVOICE_FAILURE,
    error,
    payload,
  };
};

export const createInvoice = (
  invoice:
    | InvoiceRequest
    | Array<Invoice>
    | Array<{ client: number, visits: Array<number> }>,
  token: string
): ThunkAction => {
  return (dispatch: Dispatch): Promise<Invoice | Array<Invoice> | string> => {
    dispatch(createInvoiceRequest(invoice));

    return invoicesApi
      .create("invoices", invoice, token)
      .then((responseInvoice: Invoice) => {
        dispatch(createInvoiceSuccess(responseInvoice));
        return responseInvoice;
      })
      .catch((error: string) => {
        dispatch(createInvoiceError(invoice, error));
        return error;
      });
  };
};

export const updateInvoiceRequest = (
  payload:
    | InvoiceRequest
    | Array<{ client: number, visits: Array<number> }>
    | { id: number }
): UpdateInvoiceAction => {
  return {
    type: UPDATE_INVOICE,
    payload,
  };
};

export const updateInvoiceSuccess = (
  payload: Invoice
): UpdateInvoiceSuccessAction => {
  return {
    type: UPDATE_INVOICE_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, invoiceSchema),
  };
};

export const updateInvoiceError = (
  payload: Invoice | { id: number },
  error: string
): UpdateInvoiceFailureAction => {
  return {
    type: UPDATE_INVOICE_FAILURE,
    error,
    payload,
  };
};

export const updateInvoice = (invoice: Invoice, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateInvoiceRequest(invoice));

    return invoicesApi
      .update("invoices", invoice, token)
      .then((responseInvoice: Invoice) => {
        dispatch(updateInvoiceSuccess(responseInvoice));
        return responseInvoice;
      })
      .catch((error: string) => {
        dispatch(updateInvoiceError(invoice, error));
        return error;
      });
  };
};

export const partialUpdateInvoice = (
  invoice: { id: number },
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateInvoiceRequest(invoice));

    return invoicesApi
      .update("invoices", invoice, token, true)
      .then((responseInvoice: Invoice) => {
        const coercedInvoice = responseInvoice;
        dispatch(updateInvoiceSuccess(coercedInvoice));
        return coercedInvoice;
      })
      .catch((error: string) => {
        dispatch(updateInvoiceError(invoice, error));
        return error;
      });
  };
};

export const deleteInvoiceRequest = (payload: Invoice): DeleteInvoiceAction => {
  return {
    type: DELETE_INVOICE,
    payload,
  };
};

export const deleteInvoiceSuccess = (
  payload: Invoice
): DeleteInvoiceSuccessAction => {
  return {
    type: DELETE_INVOICE_SUCCESS,
    receivedAt: Date.now(),
    payload,
  };
};

export const deleteInvoiceError = (
  payload: Invoice,
  error: string
): DeleteInvoiceFailureAction => {
  return {
    type: DELETE_INVOICE_FAILURE,
    error,
    payload,
  };
};

export const deleteInvoice = (invoice: Invoice, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(deleteInvoiceRequest(invoice));

    return invoicesApi
      .delete("invoices", invoice, token)
      .then(() => {
        dispatch(deleteInvoiceSuccess(invoice));
        return invoice;
      })
      .catch((error: string) => {
        dispatch(deleteInvoiceError(invoice, error));
        return error;
      });
  };
};
