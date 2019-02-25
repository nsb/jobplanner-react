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
    onDelete: Function,
    onClose: Function,
    visit: Visit,
    job: ?Job,
    partialUpdateVisitAndLoadJob: Function
  }
): Props => {
  const { auth, entities, visits } = state;

  return {
    token: auth.token,
    isFetching: visits.isFetching,
    visit: ownProps.visit,
    job: ownProps.job,
    property: ensureState(entities).properties[ownProps.visit.property],
    assigned: ownProps.visit.assigned.map((Id: number) => {
      return ensureState(entities).employees[Id];
    }).filter(employee => employee),
    lineItems: ownProps.visit.line_items.map((Id) => {
      return ensureState(entities).lineItems[Id]
    }),
    onEdit: ownProps.onEdit,
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
