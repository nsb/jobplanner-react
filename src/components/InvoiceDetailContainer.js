// @flow
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ensureState } from "redux-optimistic-ui";
import { fetchInvoice, partialUpdateInvoice } from "../actions/invoices";
import InvoiceDetail from "./InvoiceDetail";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Props } from "./InvoiceDetail";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number, invoiceId: number } },
    history: { push: Function },
    dispatch: Dispatch,
    fetchInvoice: (string, number) => ThunkAction,
    partialUpdateInvoice: ({ id: number }, string) => ThunkAction
  }
): Props => {
  const { invoices, entities, auth } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const invoiceId = parseInt(ownProps.match.params.invoiceId, 10);
  const invoice = ensureState(entities).invoices[invoiceId];

  return {
    business: ensureState(entities).businesses[businessId],
    invoice: invoice,
    invoiceId: invoiceId,
    fetchInvoice: ownProps.fetchInvoice,
    partialUpdateInvoice: ownProps.partialUpdateInvoice,
    isFetching: invoices.isFetching,
    token: auth.token
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchInvoice,
      partialUpdateInvoice
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceDetail);
