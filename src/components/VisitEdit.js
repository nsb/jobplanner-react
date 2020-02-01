// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import { visitSchemaDenormalize } from "../schemas";
import { injectIntl, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import { updateVisitAndLoadJob } from "../actions/index";
import { AuthContext } from "../providers/authProvider";
import VisitForm from "./VisitForm";
import type { Visit } from "../actions/visits";
import type { Employee } from "../actions/employees";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { ensureState } from "redux-optimistic-ui";

export type Props = {
  dispatch: Dispatch,
  visit: Visit,
  employees: Array<Employee>,
  assigned: Array<Employee>,
  toggleEdit: Function,
  onClose: Function,
  isFetching: boolean
};

class VisitEdit extends Component<Props & { intl: intlShape }> {
  static contextType = AuthContext;

  render() {
    const { visit, employees, assigned, isFetching } = this.props;

    return (
      <VisitForm
        onSubmit={this.handleSubmit}
        initialValues={{
          ...visit,
          assigned: assigned.map(employee => {
            return {
              value: employee.id,
              label: [employee.first_name, employee.last_name].join(' ')
            };
          })
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
  ownProps: {
    visit: Visit,
    toggleEdit: Function
  }
): * => {
  const { employees, entities, visits, jobs } = state;

  return {
    employees: employees.result
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .filter(employee => employee.business === ownProps.visit.business),
    assigned: ownProps.visit.assigned
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .filter(employee => employee),
    visit: denormalize(
      ensureState(entities).visits[ownProps.visit.id],
      visitSchemaDenormalize,
      ensureState(entities)
    ),
    toggleEdit: ownProps.toggleEdit,
    isFetching: ensureState(visits).isFetching || jobs.isFetching
  };
};

export default connect(mapStateToProps)(injectIntl(VisitEdit));
