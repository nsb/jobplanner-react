// @flow

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createVisitAndLoadJob } from "../actions/index";
import VisitAdd from "./VisitAdd";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { LineItem } from "../actions/lineitems";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Props } from "./VisitAdd";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    business: Business,
    job: Job,
    lineItems: Array<LineItem>,
    onClose: Function
  }
): Props => {
  const { employees, entities, visits } = state;

  return {
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
    lineItems: ownProps.job.line_items.map((Id: number) => {
      return ensureState(entities).lineItems[Id]
    }),
    onClose: ownProps.onClose,
    createVisitAndLoadJob: createVisitAndLoadJob,
    isFetching: visits.isFetching
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ createVisitAndLoadJob }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(VisitAdd);
