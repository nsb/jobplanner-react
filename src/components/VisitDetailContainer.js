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

  // TODO: Make sure job is loaded before rendering visit detail!!!
  const lineItems = ownProps.job
    ? ownProps.job.line_items.map(Id => ensureState(entities).lineItems[Id])
    : [];

  const overrides = ownProps.visit.overrides.map(
    Id => ensureState(entities).lineItemOverrides[Id]
  );

  const lineItemsWithOverrides = lineItems.map(
    lineItem =>
      overrides.find(override => override.line_item === lineItem.id) || lineItem
  );

  return {
    isFetching: visits.isFetching,
    visit: ownProps.visit,
    job: ownProps.job,
    property: ensureState(entities).properties[ownProps.visit.property],
    assigned: ownProps.visit.assigned.map(Id => {
      return ensureState(entities).employees[Id];
    }),
    lineItems: lineItemsWithOverrides,
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
