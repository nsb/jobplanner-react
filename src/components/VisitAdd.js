// @flow

import React, { Component } from "react";
import Layer from "grommet/components/Layer";
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
  createVisitAndLoadJob: Function
};

class VisitAdd extends Component<Props> {
  render() {
    const { employees, onClose, job, lineItems } = this.props;

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
        />
      </Layer>
    );
  }

  handleSubmit = (values: Object) => {
    const { business, job, token, createVisitAndLoadJob, onClose } = this.props;
    if(token) {
      createVisitAndLoadJob(
        business,
        {
          ...values,
          job: job.id,
          assigned: values.assigned && values.assigned.map(v => v.value)
        },
        token || ""
      );
      onClose()
    }
  };
}

export default VisitAdd;
