// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import { visitSchemaDenormalize } from "../schemas";
import { createVisit } from "../actions/visits";
import VisitForm from "./VisitForm";
import type { Business } from "../actions/businesses";
import type { Visit } from "../actions/visits";
import type { Employee } from "../actions/employees";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { ensureState } from "redux-optimistic-ui";

export type Props = {
  dispatch: Dispatch,
  employees: Array<Employee>,
  token: string,
  business: Business
};

class VisitAdd extends Component<Props> {
  render() {
    const { employees } = this.props;

    return (
      <VisitForm
        onSubmit={this.handleSubmit}
        employees={employees}
      />
    );
  }

  handleSubmit = values => {
    const { business, token, dispatch } = this.props;
    dispatch(
      createVisit(
        business,
        {
          ...values,
          assigned: values.assigned.map(v => v.value)
        },
        token || ""
      )
    );
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    business: Business,
  }
): * => {
  const { auth, employees, entities } = state;

  return {
    token: auth.token,
    employees: employees.result
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .filter(employee => {
        return employee.businesses.indexOf(ownProps.business) > -1
          ? employee
          : false;
      }),
  };
};

export default connect(mapStateToProps)(VisitAdd);
