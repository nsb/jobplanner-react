// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import { visitSchemaDenormalize } from "../schemas";
import { updateVisit } from "../actions/visits";
import VisitForm from "./VisitForm";
import type { Visit } from "../actions/visits";
import type { Employee } from "../actions/employees";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { ensureState } from "redux-optimistic-ui";

export type Props = {
  visit: Visit,
  employees: Array<Employee>,
  assigned: Array<Employee>,
  token: string,
  toggleEdit: Function,
  updateVisit: (
    { id: number, begins: Date, ends: Date, anytime: boolean },
    string,
    boolean,
    boolean
  ) => ThunkAction
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
    const { token, toggleEdit } = this.props;
    updateVisit(
      {
        ...values,
        assigned: values.assigned.map(v => v.value)
      },
      token || ""
    );
    toggleEdit();
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    visit: Visit,
    toggleEdit: Function
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

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      updateVisit
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(VisitEdit);
