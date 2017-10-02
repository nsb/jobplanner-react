// @flow
import { connect } from "react-redux";
import VisitLayer from "./VisitLayer";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";

type Props = {
  visit: Visit,
  dispatch: Dispatch,
  onClose: Function
};

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    dispatch: Dispatch,
    visit: Visit,
    onClose: Function
  }
): Props => {

  return {
    visit: ownProps.visit,
    dispatch: ownProps.dispatch,
    onClose: ownProps.onClose
  };
};

export default connect(mapStateToProps)(VisitLayer);
