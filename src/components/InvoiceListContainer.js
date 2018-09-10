// @flow
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { intlShape } from "react-intl";
import { ensureState } from "redux-optimistic-ui";
import { fetchInvoices } from "../actions/invoices";
import InvoiceList from "./InvoiceList";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Props } from "./InvoiceList";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number } },
    history: { push: Function },
    dispatch: Dispatch,
    fetchInvoices: (string, ?Object) => ThunkAction
  }
): Props => {
  const { invoices, entities, auth } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: ensureState(entities).businesses[businessId],
    invoices: invoices.result.map((Id: number) => {
      return ensureState(entities).invoices[Id];
    }),
    isFetching: invoices.isFetching,
    token: auth.token,
    totalCount: invoices.count,
    fetchInvoices: ownProps.fetchInvoices,
    intl: intlShape
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchInvoices
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceList);
