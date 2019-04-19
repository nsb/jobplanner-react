// @flow

import { connect } from "react-redux";
import InvoiceBatchClient from "./InvoiceBatchClient";
import { jobsWithRequiresInvoicing } from "../selectors/jobSelectors";
import type { Props } from "./InvoiceBatchClient";
import type { Client } from "../actions/clients";
import type { State as ReduxState } from "../types/State";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    client: Client
  }
): Props => {

  return {
    client: ownProps.client,
    jobs: jobsWithRequiresInvoicing(state).filter((job) => job.client === ownProps.client.id)
  };
};

export default connect(mapStateToProps)(InvoiceBatchClient);
