// @flow
import { connect } from "react-redux";
import VisitLayer from "./VisitLayer";
import type { Props } from "./VisitLayer";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    visit: Visit,
    onClose: Function
  }
): Props => {
  const { auth } = state;
  return {
    token: auth.token,
    visit: ownProps.visit,
    onClose: ownProps.onClose
  };
};

export default connect(mapStateToProps)(VisitLayer);
