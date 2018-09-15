// @flow
import { connect } from "react-redux";
import { ensureState } from "redux-optimistic-ui";
import InvoiceListItemClient from "./InvoiceListItemClient";
import type { State as ReduxState } from "../types/State";
import type { Props } from "./InvoiceListItemClient";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    clientId: number
  }
): Props => {
  const { entities } = state;

  return {
    client: ensureState(entities).clients[ownProps.clientId]
  };
};

export default connect(
  mapStateToProps,
)(InvoiceListItemClient);
