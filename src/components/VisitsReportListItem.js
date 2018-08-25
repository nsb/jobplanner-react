// @flow

import React, { Component } from "react";
import ListItem from "grommet/components/ListItem";
import Timestamp from "grommet/components/Timestamp";
import type { Visit } from "../actions/visits";
import type { Employee } from "../actions/employees";

type Props = {
  visit: Visit,
  assigned: Array<Employee>,
  index: number
};

class VisitsReportListItem extends Component<Props> {
  render() {
    const { visit, assigned, index } = this.props;

    let assignedNames;
    if (assigned.length) {
       assignedNames = (
        <span>Assigned to {assigned.map(employee => employee.first_name).join(", ")}</span>
      );
    } else {
      assignedNames = (
        <span>Not assigned</span>
      )
    }
    return (
      <ListItem
        direction="row"
        align="center"
        justify="between"
        separator={index === 0 ? "horizontal" : "bottom"}
        pad={{ horizontal: "medium", vertical: "small", between: "medium" }}
        responsive={true}
        onClick={undefined}
        selected={false}
      >
        <span>
          <Timestamp
            fields={visit.anytime ? "date" : ["date", "time"]}
            value={visit.begins}
          />
        </span>
        <span>{`${visit.client_name}`}</span>
        {assignedNames}
      </ListItem>
    );
  }
}

export default VisitsReportListItem;
