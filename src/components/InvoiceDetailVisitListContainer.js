// @flow
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ensureState } from "redux-optimistic-ui";
import { fetchVisits } from "../actions/visits";
import InvoiceDetailVisitList from "./InvoiceDetailVisitList";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Props } from "./InvoiceDetailVisitList";
import type { Invoice } from "../actions/invoices";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    dispatch: Dispatch,
    fetchVisits: (string, Object) => ThunkAction,
    invoice: Invoice
  }
): Props => {
  const { visits, entities, auth } = state;

  return {
    invoice: ownProps.invoice,
    visits: ownProps.invoice.visits
      .map(visitId => {
        return ensureState(entities).visits[visitId];
      })
      .filter(visit => visit),
    fetchVisits: ownProps.fetchVisits,
    isFetching: visits.isFetching,
    token: auth.token
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchVisits
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceDetailVisitList);
