// @flow
import { connect } from "react-redux";
import VisitLayer from "./VisitLayer";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Property } from "../actions/properties";
import { ensureState } from "redux-optimistic-ui";
import type { Props } from "./VisitLayer";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    dispatch: Dispatch,
    visit: Visit,
    onClose: Function
  }
): Props => {
  const { properties, entities } = state;

  return {
    visit: ownProps.visit,
    dispatch: ownProps.dispatch,
    onClose: ownProps.onClose,
    property: ensureState(entities).properties[ownProps.visit.property],
  };
};

export default connect(mapStateToProps)(VisitLayer);
