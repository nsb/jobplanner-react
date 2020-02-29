// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import { updateVisitAndLoadJob } from "../actions/index";
import { AuthContext } from "../providers/authProvider";
import VisitForm from "./VisitForm";
import type { Visit } from "../actions/visits";
import type { Employee } from "../actions/employees";
import type { LineItem } from "../actions/lineitems";
import type { LineItemOverride } from "../actions/lineitemoverrides";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { ensureState } from "redux-optimistic-ui";

export type Props = {
  dispatch: Dispatch,
  visit: Visit,
  employees: Array<Employee>,
  assigned: Array<Employee>,
  overrides: Array<LineItemOverride>,
  toggleEdit: Function,
  onClose: Function,
  isFetching: boolean
};

class VisitEdit extends Component<Props & { intl: intlShape }> {
  static contextType = AuthContext;

  render() {
    const { visit, employees, assigned, overrides, isFetching } = this.props;

    return (
      <VisitForm
        onSubmit={this.handleSubmit}
        initialValues={{
          ...visit,
          assigned: assigned.map(employee => {
            return {
              value: employee.id,
              label: [employee.first_name, employee.last_name].join(" ")
            };
          }),
          overrides: overrides
        }}
        employees={employees}
        isFetching={isFetching}
      />
    );
  }

  handleSubmit = values => {
    const { dispatch, onClose, intl } = this.props;
    const { getUser } = this.context;

    return getUser()
      .then(({ access_token }) => {
        return dispatch(
          updateVisitAndLoadJob(
            {
              ...values,
              assigned: values.assigned.map(v => v.value)
            },
            access_token || ""
          )
        );
      })
      .then(() => {
        addSuccess({ text: intl.formatMessage({ id: "flash.saved" }) });
      })
      .catch(() => {
        addError({ text: intl.formatMessage({ id: "flash.error" }) });
      })
      .finally(onClose);
  };
}

const mapStateToProps = (
  state: ReduxState,
  {
    visit,
    toggleEdit
  }: {
    visit: Visit,
    toggleEdit: Function
  }
): * => {
  const { employees, entities, visits, jobs } = state;

  // TODO: Make sure job is loaded before rendering visit detail!!!
  const job = ensureState(entities).jobs[visit.job];

  const lineItems = job
    ? job.line_items.map(Id => ensureState(entities).lineItems[Id])
    : [];

  const overridesForLineItems = lineItems.map(
    (lineItem: LineItem): LineItemOverride => {
      return {
        line_item: lineItem.id,
        visit: visit.id,
        name: lineItem.name,
        description: lineItem.description,
        unit_cost: lineItem.unit_cost,
        quantity: lineItem.quantity
      };
    }
  );

  const overrides = visit.overrides.map(
    Id => ensureState(entities).lineItemOverrides[Id]
  );

  const lineItemsWithOverrides = overridesForLineItems.map(
    lineItem =>
      overrides.find(override => override.line_item === lineItem.line_item) ||
      lineItem
  );

  return {
    employees: employees.result
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .filter(employee => employee.business === visit.business),
    assigned: visit.assigned.map((Id: number) => {
      return ensureState(entities).employees[Id];
    }),
    overrides: lineItemsWithOverrides,
    visit: visit,
    toggleEdit: toggleEdit,
    isFetching: ensureState(visits).isFetching || jobs.isFetching
  };
};

export default connect(mapStateToProps)(injectIntl(VisitEdit));
