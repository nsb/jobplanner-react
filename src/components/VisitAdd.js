// @flow

import React, { Component } from "react";
import Layer from "grommet/components/Layer";
import { injectIntl, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import VisitForm from "./VisitForm";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { LineItem } from "../actions/lineitems";
import type { Employee } from "../actions/employees";

export type Props = {
  employees: Array<Employee>,
  token: ?string,
  business: Business,
  job: Job,
  lineItems: Array<LineItem>,
  onClose: Function,
  createVisitAndLoadJob: Function,
  isFetching: boolean
};

class VisitAdd extends Component<Props & { intl: intlShape }> {
  render() {
    const { employees, onClose, job, lineItems, isFetching } = this.props;

    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <VisitForm
          initialValues={{
            description: "",
            begins: new Date(),
            ends: new Date(),
            anytime: false,
            assigned: [],
            line_items: lineItems,
            job: job.id
          }}
          onSubmit={this.handleSubmit}
          employees={employees}
          isFetching={isFetching}
        />
      </Layer>
    );
  }

  handleSubmit = (values: Object) => {
    const { business, job, token, createVisitAndLoadJob, onClose, intl } = this.props;
    if(token) {
      createVisitAndLoadJob(
        business,
        {
          ...values,
          job: job.id,
          assigned: values.assigned && values.assigned.map(v => v.value)
        },
        token || ""
      ).then(
        () => {
          addSuccess({text: intl.formatMessage({id: "flash.saved"})});
        }).catch(() => {
          addError({text: intl.formatMessage({id: "flash.error"})});
        }
      ).finally(onClose);
    }
  };
}

export default injectIntl(VisitAdd);
