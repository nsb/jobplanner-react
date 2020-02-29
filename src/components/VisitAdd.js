// @flow

import React, { Component } from "react";
import Layer from "grommet/components/Layer";
import { injectIntl, intlShape } from "react-intl";
import { Provider } from "react-redux";
import { addSuccess, addError } from "redux-flash-messages";
import store from "../store";
import VisitForm from "./VisitForm";
import { AuthContext } from "../providers/authProvider";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { LineItemOverride } from "../actions/lineitemoverrides";
import type { Employee } from "../actions/employees";

export type Props = {
  employees: Array<Employee>,
  business: Business,
  job: Job,
  overrides: Array<LineItemOverride>,
  onClose: Function,
  createVisitAndLoadJob: Function,
  isFetching: boolean
};

class VisitAdd extends Component<Props & { intl: intlShape }> {
  static contextType = AuthContext;

  render() {
    const { employees, onClose, job, overrides, isFetching } = this.props;

    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <Provider store={store} >
          <VisitForm
            initialValues={{
              description: "",
              begins: new Date(),
              ends: new Date(),
              anytime: true,
              assigned: [],
              overrides: overrides,
              job: job.id
            }}
            onSubmit={this.handleSubmit}
            employees={employees}
            isFetching={isFetching}
          />
        </Provider>
      </Layer>
    );
  }

  handleSubmit = (values: Object) => {
    const { business, job, createVisitAndLoadJob, onClose, intl } = this.props;
    const { getUser } = this.context;
    getUser().then(({ access_token }) => {
      return createVisitAndLoadJob(
        business,
        {
          ...values,
          job: job.id,
          assigned: values.assigned && values.assigned.map(v => v.value)
        },
        access_token || ""
      )
    }).then(
      () => {
        addSuccess({text: intl.formatMessage({id: "flash.saved"})});
      }).catch(() => {
        addError({text: intl.formatMessage({id: "flash.error"})});
      }
    ).finally(onClose);
  };
}

export default injectIntl(VisitAdd);
