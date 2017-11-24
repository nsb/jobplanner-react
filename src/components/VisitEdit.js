// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import { visitSchemaDenormalize } from "../schemas";
import { updateVisit } from "../actions/visits";
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
  token: string,
  toggleEdit: Function
};

class VisitEdit extends Component<Props> {
  render() {
    const { visit, employees, assigned } = this.props;

    return (
      <VisitForm
        onSubmit={this.handleSubmit}
        initialValues={{
          ...visit,
          assigned: assigned.map(employee => {
            return { value: employee.id, label: employee.username };
          })
        }}
        employees={employees}
      />
    );
  }

  handleSubmit = values => {
    const { token, dispatch, toggleEdit } = this.props;
    dispatch(
      updateVisit(
        {
          ...values,
          assigned: values.assigned.map(v => v.value)
        },
        token || ""
      )
    );
    toggleEdit()
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    dispatch: Dispatch,
    visit: Visit,
    toggleEdit: Function
  }
): Props => {
  const { auth, employees, entities } = state;

  return {
    token: auth.token,
    dispatch: ownProps.dispatch,
    employees: employees.result
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .filter(employee => {
        return employee.businesses.indexOf(ownProps.visit.business) > -1
          ? employee
          : false;
      }),
    assigned: ownProps.visit.assigned.map((Id: number) => {
      return ensureState(entities).employees[Id];
    }),
    visit: denormalize(
      ensureState(entities).visits[ownProps.visit.id],
      visitSchemaDenormalize,
      ensureState(entities)
    ),
    toggleEdit: ownProps.toggleEdit
  };
};

export default connect(mapStateToProps)(VisitEdit);
