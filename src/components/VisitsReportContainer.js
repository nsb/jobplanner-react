// @flow
import { connect } from "react-redux";
import VisitsReport from "./VisitsReport";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Props } from "./VisitsReport";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  { entities, employees }: ReduxState,
  ownProps: {
    match: { params: { businessId: number } },
    history: { push: Function },
    dispatch: Dispatch
  }
): Props => {
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: ensureState(entities).businesses[businessId],
    employees: employees.result
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .filter(employee => employee.business === businessId)
  };
};

export default connect(mapStateToProps)(VisitsReport);
