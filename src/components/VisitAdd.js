// @flow

import React, { Component } from "react";
import Layer from "grommet/components/Layer";
import VisitForm from "./VisitForm";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { Employee } from "../actions/employees";

export type Props = {
  employees: Array<Employee>,
  token: string,
  business: Business,
  job: Job,
  onClose: Function,
  createVisit: Function
};

class VisitAdd extends Component<Props> {
  render() {
    const { employees, onClose, job } = this.props;

    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <VisitForm
          initialValues={{
            description: "",
            begins: new Date(),
            ends: new Date(),
            anytime: false,
            assigned: [],
            line_items: [],
            job: job.id
          }}
          onSubmit={this.handleSubmit}
          employees={employees}
        />;
      </Layer>
    );
  }

  handleSubmit = (values: Object) => {
    const { business, job, token, createVisit, onClose } = this.props;
    createVisit(
      business,
      {
        ...values,
        job: job.id,
        assigned: values.assigned && values.assigned.map(v => v.value)
      },
      token || ""
    );
    onClose()
  };
}

export default VisitAdd;
