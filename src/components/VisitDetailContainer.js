// @flow

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import VisitDetail from "./VisitDetail";
import { partialUpdateVisit, deleteVisit } from "../actions/visits";
import type { Visit } from "../actions/visits";
import type { Props } from "./VisitDetail";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    onEdit: Function,
    visit: Visit
  }
): Props => {
  const { auth, entities, visits } = state;

  return {
    token: auth.token,
    isFetching: visits.isFetching,
    visit: ownProps.visit,
    property: ensureState(entities).properties[ownProps.visit.property],
    assigned: ownProps.visit.assigned.map((Id: number) => {
      return ensureState(entities).employees[Id];
    }).filter(employee => employee),
    lineItems: ownProps.visit.line_items.map((Id) => {
      return ensureState(entities).lineItems[Id]
    }),
    onEdit: ownProps.onEdit,
    partialUpdateVisit: partialUpdateVisit,
    deleteVisit: deleteVisit
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      partialUpdateVisit,
      deleteVisit
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(VisitDetail);
