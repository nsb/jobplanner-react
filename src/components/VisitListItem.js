// @flow

import React, { Component } from "react";
import ListItem from "grommet/components/ListItem";
import Timestamp from "grommet/components/Timestamp";
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

    return (
      <ListItem
        direction="row"
        align="center"
        justify="between"
        separator={index === 0 ? "horizontal" : "bottom"}
        pad={{ horizontal: "medium", vertical: "small", between: "medium" }}
        responsive={false}
        onClick={onClick}
        selected={false}
      >
        {clientName}
        <span>
          <Timestamp
            fields={visit.anytime ? "date" : ["date", "time"]}
            value={visit.begins}
          />
        </span>
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
