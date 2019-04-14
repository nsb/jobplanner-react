// @flow

import React, { Component } from "react";
import Box from "grommet/components/Box";
import ListItem from "grommet/components/ListItem";
import Timestamp from "grommet/components/Timestamp";
import Tag from "./Tag";
import type { Visit } from "../actions/visits";
import type { Employee } from "../actions/employees";
import type { Job } from "../actions/jobs";

export type Props = {
  visit: Visit,
  assigned: Array<Employee>,
  job?: Job,
  index: number,
  onClick: Visit => void
};

class VisitListItem extends Component<Props> {
  render() {
    const { visit, assigned, index, onClick, job } = this.props;

    let clientName = job ? undefined : (<span>{visit.client_name}</span>);
    let details = visit.completed ? (<span>Completed</span>) : (<span>{visit.details}</span>);

    let is_overdue;
    if (visit.is_overdue) {
      is_overdue = (
        <Tag text="Overdue" color="accent-2" />
      )
    }

    return (
      <ListItem
        direction="row"
        align="start"
        justify="between"
        separator={index === 0 ? "horizontal" : "bottom"}
        pad={{ horizontal: "medium", vertical: "small", between: "medium" }}
        responsive={true}
        onClick={onClick}
        selected={false}
      >
        {clientName}
        <span>
          <Box>
          <Timestamp
            fields={visit.anytime ? "date" : ["date", "time"]}
            value={visit.begins}
          />
          {is_overdue}
          </Box>
        </span>
        {details}
        <span>
          {assigned.length
            ? assigned
                .map(
                  (a: Employee) =>
                    a.first_name || a.last_name
                      ? `${a.first_name} ${a.last_name}`
                      : a.username
                )
                .join(", ")
            : "Not assigned yet"}
        </span>
      </ListItem>
    );
  }
}

export default VisitListItem;
