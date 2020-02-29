// @flow

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createVisitAndLoadJob } from "../actions/index";
import VisitAdd from "./VisitAdd";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { LineItem } from "../actions/lineitems";
import type { LineItemOverride } from "../actions/lineitemoverrides";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Props } from "./VisitAdd";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  {
    business,
    job,
    onClose
  }: {
    business: Business,
    job: Job,
    onClose: Function
  }
): Props => {
  const { employees, entities, visits } = state;

  const lineItems = job.line_items.map(
    Id => ensureState(entities).lineItems[Id]
  );

  const overridesForLineItems = lineItems.map(
    (lineItem: LineItem): LineItemOverride => {
      return {
        line_item: lineItem.id,
        name: lineItem.name,
        description: lineItem.description,
        unit_cost: lineItem.unit_cost,
        quantity: lineItem.quantity
      };
    }
  );

  return {
    employees: employees.result
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .filter(employee => employee.business === business.id),
    business: business,
    job: job,
    overrides: overridesForLineItems,
    onClose: onClose,
    createVisitAndLoadJob: createVisitAndLoadJob,
    isFetching: visits.isFetching
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ createVisitAndLoadJob }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(VisitAdd);
