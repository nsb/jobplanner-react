// @flow

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import VisitDetail from "./VisitDetail";
import { partialUpdateVisitAndLoadJob } from "../actions/index";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import type { Props } from "./VisitDetail";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    onEdit: Function,
    onUpdateFutureVisits: Function,
    onDelete: Function,
    onClose: Function,
    visit: Visit,
    job: ?Job,
    partialUpdateVisitAndLoadJob: Function
  }
): Props => {
  const { entities, visits } = state;

  return {
    isFetching: ensureState(visits).isFetching,
    visit: ownProps.visit,
    job: ownProps.job,
    property: ensureState(entities).properties[ownProps.visit.property],
    assigned: ownProps.visit.assigned.map(Id => {
      return ensureState(entities).employees[Id];
    }),
    onEdit: ownProps.onEdit,
    onUpdateFutureVisits: ownProps.onUpdateFutureVisits,
    partialUpdateVisitAndLoadJob: ownProps.partialUpdateVisitAndLoadJob,
    onDelete: ownProps.onDelete,
    onClose: ownProps.onClose
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      partialUpdateVisitAndLoadJob
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(VisitDetail);
