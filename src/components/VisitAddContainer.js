// @flow

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createVisit } from "../actions/visits";
import VisitAdd from "./VisitAdd";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Props } from "./VisitAdd";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    business: Business,
    job: Job,
    onClose: Function
  }
): Props => {
  const { auth, employees, entities } = state;

  return {
    token: auth.token,
    employees: employees.result
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .filter(employee => {
        return employee.businesses.indexOf(ownProps.business.id) > -1
          ? employee
          : false;
      }),
    business: ownProps.business,
    job: ownProps.job,
    onClose: ownProps.onClose,
    createVisit: createVisit
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ createVisit }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(VisitAdd);
