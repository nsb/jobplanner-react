// @flow
import { connect } from "react-redux";
import { ensureState } from "redux-optimistic-ui";
import InvoiceDetailLineItemList from "./InvoiceDetailLineItemList";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Props } from "./InvoiceDetailLineItemList";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    dispatch: Dispatch,
    lineItems: Array<number>
  }
): Props => {
  const { entities } = state;

  return {
    lineItems: ownProps.lineItems.map(id => {
      return ensureState(entities).lineItems[id];
    })
  };
};

export default connect(mapStateToProps)(InvoiceDetailLineItemList);
