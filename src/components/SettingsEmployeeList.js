// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl, FormattedMessage, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import { ensureState } from "redux-optimistic-ui";
import type { Business } from "../actions/businesses";
import type { Employee } from "../actions/employees";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { createEmployee, updateEmployee } from "../actions/employees";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Accordion from "grommet/components/Accordion";
import AccordionPanel from "grommet/components/AccordionPanel";
import Paragraph from "grommet/components/Paragraph";
import EmployeeForm, { employeeRoleMap } from "./SettingsEmployeeForm";
import { AuthContext } from "../providers/authProvider";

const intlTitle = (
  <FormattedMessage
    id="settingsEmployeeList.title"
    description="Settings employee list title"
    defaultMessage="Employees"
  />
);

const intlAdd = (
  <FormattedMessage
    id="settingsEmployeeList.add"
    description="Settings employee list add"
    defaultMessage="Add employee"
  />
);

type Props = {
  business: Business,
  employees: Array<Employee>,
  dispatch: Dispatch,
};

type State = {
  activePanel?: number,
};

class EmployeeList extends Component<Props & { intl: intlShape }, State> {
  static contextType = AuthContext;

  constructor(props: Props & { intl: intlShape }) {
    super(props);
    const { employees } = props;
    this.state = { activePanel: employees.length };
  }

  render() {
    const { employees, intl } = this.props;
    return (
      <Box>
        <Header>
          <Heading tag="h3" strong={true}>
            {intlTitle}
          </Heading>
        </Header>
        <Accordion onActive={this.onActive}>
          {employees.map((employee, index: number) => {
            return (
              <AccordionPanel
                heading={[employee.first_name, employee.last_name].join(" ")}
                key={employee.id}
              >
                <Paragraph>
                  <EmployeeForm
                    form={`employeeform-${employee.id}`}
                    initialValues={{
                      ...employee,
                      role: {
                        value: employee.role,
                        label: intl.formatMessage({
                          id: employeeRoleMap[employee.role],
                        }),
                      },
                    }}
                    onSubmit={this.onSubmit}
                  />
                </Paragraph>
              </AccordionPanel>
            );
          })}
          <AccordionPanel heading={intlAdd} key="employee-new">
            <Paragraph>
              <EmployeeForm
                form={`employeeform-new`}
                initialValues={{
                  is_active: true,
                  role: {
                    value: "worker",
                    label: intl.formatMessage({
                      id: employeeRoleMap["worker"],
                    }),
                  },
                }}
                onSubmit={this.onSubmit}
              />
            </Paragraph>
          </AccordionPanel>
        </Accordion>
      </Box>
    );
  }

  onActive = (activePanel?: number) => {
    if (!activePanel) {
      const { employees } = this.props;
      this.setState({ activePanel: employees.length });
    }
  };

  onSubmit = (employee: Object) => {
    const { business, dispatch, intl } = this.props;

    const { getUser } = this.context;
    if (employee.id) {
      getUser()
        .then(({ access_token }) => {
          return dispatch(
            updateEmployee(
              { ...employee, role: employee.role.value },
              access_token
            )
          );
        })
        .then(() => {
          addSuccess({ text: intl.formatMessage({ id: "flash.saved" }) });
        })
        .catch(() => {
          addError({ text: intl.formatMessage({ id: "flash.error" }) });
        });
    } else {
      getUser()
        .then(({ access_token }) => {
          return dispatch(
            createEmployee(
              { ...employee, business: business.id, role: employee.role.value },
              access_token
            )
          );
        })
        .then(() => {
          addSuccess({ text: intl.formatMessage({ id: "flash.saved" }) });
        })
        .catch(() => {
          addError({ text: intl.formatMessage({ id: "flash.error" }) });
        })
        .finally(this.onActive);
    }
  };
}

const mapStateToProps = (
  { employees, entities }: ReduxState,
  ownProps: {
    business: Business,
  }
): * => ({
  business: ownProps.business,
  employees: employees.result
    .map((Id: number) => ensureState(entities).employees[Id])
    .filter((employee) => employee.business === ownProps.business.id),
});

export default connect(mapStateToProps)(injectIntl(EmployeeList));
