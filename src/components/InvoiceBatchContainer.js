// @flow

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import InvoiceBatch from "./InvoiceBatch";
import { createInvoiceAndLoadJobs } from "../actions/index";
import { jobsWithRequiresInvoicing } from "../selectors/jobSelectors";
import { getClientById } from "../selectors/clientSelectors";
import { getVisitById } from "../selectors/visitSelectors";
import type { Business } from "../actions/businesses";
import type { Props } from "./InvoiceBatch";
import type { InvoiceRequest } from "../actions/invoices";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    createInvoiceAndLoadJobs: (
      InvoiceRequest | Array<InvoiceRequest>,
      string,
      Object
    ) => ThunkAction,
    business: Business,
  }
): Props => {
  const jobs = jobsWithRequiresInvoicing(state);
  const { invoices, entities } = state;

  return {
    clients: jobs.reduce((acc, job) => {
      acc.set(job.client, getClientById(state, { id: job.client }));
      return acc;
    }, new Map()),
    jobs: jobs.reduce((acc, job) => {
      acc.set(job.id, job);
      return acc;
    }, new Map()),
    visits: jobs
      .flatMap((job) => {
        return job.visits.map((visit) => {
          return getVisitById(state, { id: visit });
        });
      })
      .reduce((acc, visit) => {
        acc.set(visit.id, visit);
        return acc;
      }, new Map()),
    hooks: ownProps.business.hooks
      .map((id) => ensureState(entities).hooks[id])
      .filter((hook) => hook.event === "invoice.added" && hook.is_active),
    createInvoiceAndLoadJobs: ownProps.createInvoiceAndLoadJobs,
    business: ownProps.business,
    isFetching: invoices.isFetching,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createInvoiceAndLoadJobs,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceBatch);
