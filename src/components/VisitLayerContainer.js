// @flow
import { connect } from "react-redux";
import VisitLayer from "./VisitLayer";
import { ensureState } from "redux-optimistic-ui";
import type { Props } from "./VisitLayer";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    visit: Visit,
    onClose: Function,
  }
): Props => {
  const { entities, employees } = state;
  return {
    visit: ownProps.visit,
    job: ensureState(entities).jobs[ownProps.visit.job],
    onClose: ownProps.onClose,
    currentEmployee: employees.result
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .find((employee) => employee.me),
  };
};

export default connect(mapStateToProps)(VisitLayer);
