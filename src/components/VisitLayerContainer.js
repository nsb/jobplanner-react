// @flow
import { connect } from "react-redux";
import VisitLayer from "./VisitLayer";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    visit: Visit,
    onClose: Function
  }
): * => {
  const { entities } = state;

  return {
    visit: ownProps.visit,
    onClose: ownProps.onClose,
    property: ensureState(entities).properties[ownProps.visit.property],
    assigned: ownProps.visit.assigned.map((Id: number) => {
      return ensureState(entities).employees[Id];
    }),
    lineItems: ownProps.visit.line_items.map((Id) => {
      return ensureState(entities).lineItems[Id]
    })
  };
};

export default connect(mapStateToProps)(VisitLayer);
