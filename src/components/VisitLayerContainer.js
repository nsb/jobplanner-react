// @flow
import { connect } from "react-redux";
import VisitLayer from "./VisitLayer";
import type { Props } from "./VisitLayer";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    visit: Visit,
    job: ?Job,
    onClose: Function
  }
): Props => {
  const { auth } = state;
  return {
    token: auth.token,
    visit: ownProps.visit,
    job: ownProps.job,
    onClose: ownProps.onClose
  };
};

export default connect(mapStateToProps)(VisitLayer);
