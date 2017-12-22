// @flow

import React, { Component } from "react";
import ListItem from "grommet/components/ListItem";
import Timestamp from "grommet/components/Timestamp";
import type { Visit } from "../actions/visits";
import type { Employee } from "../actions/employees";

export type Props = {
  visit: Visit,
  assigned: Array<Employee>,
  index: number,
  onClick: (Visit) => void
};

class VisitListItem extends Component<Props> {
  render() {
    const { visit, assigned, index, onClick } = this.props;

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
        <span>
          <Timestamp
            fields={visit.anytime ? "date" : ["date", "time"]}
            value={visit.begins}
          />
        </span>
        <span>
          {visit.assigned
            ? assigned.map(a => a.username).join(", ")
            : "Not assigned yet"}
        </span>
      </ListItem>
    );
  }
}

export default VisitListItem;
