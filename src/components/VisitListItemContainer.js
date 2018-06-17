// @flow
import { connect } from "react-redux";
import VisitListItem from "./VisitListItem";
import type { Props } from "./VisitListItem";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    visit: Visit,
    job?: Job,
    index: number,
    onClick: (Visit) => void
  }
): Props => {
  const { entities } = state;

  return {
    visit: ownProps.visit,
    assigned: ownProps.visit.assigned.map(Id => {
      return ensureState(entities).employees[Id];
    }).filter(employee => employee),
    job: ownProps.job,
    onClick: ownProps.onClick,
    index: ownProps.index
  };
};

export default connect(mapStateToProps)(VisitListItem);
