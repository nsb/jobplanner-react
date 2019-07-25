// @flow
import { connect } from "react-redux";
// import moment from "moment";
import CalendarDateHeader from "./CalendarDateHeader";
import { getVisitsGroupedByDay } from "../selectors/visitSelectors";

import { Props } from "./CalendarDateHeader";
import type { State as ReduxState } from "../types/State";
// import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    label: React.Node,
    date: Date,
    drilldownView: string,
    onDrillDown: Function,
    isOffRange: boolean,
  }
): Props => {
  return {
    visits: getVisitsGroupedByDay(state),
    // visitCount: ensureState(visits).result
    //   .map(Id => {
    //     return ensureState(entities).visits[Id];
    //   })
    //   .filter((visit) => {
    //     return ((visit.begins >= ownProps.date) && (visit.ends <= moment(ownProps.date).add('days', 1).toDate()))
    //   }).length,
    label: ownProps.label,
    date: ownProps.date,
    drilldownView: ownProps.drilldownView,
    onDrillDown: ownProps.onDrillDown,
    isOffRange: ownProps.isOffRange
  };
};

export default connect(mapStateToProps)(CalendarDateHeader);
