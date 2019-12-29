// @flow

import { connect } from "react-redux";
import InvoiceBatchClient from "./InvoiceBatchClient";
import { jobsWithRequiresInvoicing } from "../selectors/jobSelectors";
import type { Props } from "./InvoiceBatchClient";
import type { Client } from "../actions/clients";
import type { State as ReduxState } from "../types/State";
import type { ClientSelection } from "../utils/invoices";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    client: Client,
    selected: ClientSelection,
    onChange: (ClientSelection) => void
  }
): Props => {

  return {
    client: ownProps.client,
    jobs: jobsWithRequiresInvoicing(state).filter((job) => job.client === ownProps.client.id),
    selected: ownProps.selected,
    onChange: ownProps.onChange,
  };
};

export default connect(mapStateToProps)(InvoiceBatchClient);
