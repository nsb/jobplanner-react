// @flow

import React, { Component } from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Box from "grommet/components/Box";
import ListItem from "grommet/components/ListItem";
import Timestamp from "grommet/components/Timestamp";
import VisitStatusTag from "./VisitStatusTag";
import type { Visit } from "../actions/visits";
import type { Employee } from "../actions/employees";
import type { Job } from "../actions/jobs";

const intlOverdue = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="visitListItem.overdueTag"
    description="Visit list item overdue tag"
    defaultMessage="Overdue"
  />
)

const intlAssigned = (
  <FormattedMessage
    id="visitListItem.noneAssigned"
    description="Visit list item none assigned"
    defaultMessage="Not assigned yet"
  />
)

const intlCompleted = (
  <FormattedMessage
    id="visitListItem.completed"
    description="Visit list completed"
    defaultMessage="Completed"
  />
)

export type Props = {
  visit: Visit,
  assigned: Array<Employee>,
  job?: Job,
  index: number,
  onClick: Visit => void
};

class VisitListItem extends Component<Props & { intl: intlShape }> {
  render() {
    const { visit, assigned, index, onClick, job } = this.props;

    let clientName = job ? undefined : (<span>{visit.client_name}</span>);
    let details = visit.completed ? intlCompleted : (<span>{visit.details}</span>);

    let is_overdue;
    if (visit.is_overdue) {
      is_overdue = (
        <VisitStatusTag status={visit.status} />
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
                .map((employee: Employee) => [employee.first_name, employee.last_name].join(' '))
                .join(", ")
            : intlAssigned}
        </span>
      </ListItem>
    );
  }
}

export default injectIntl(VisitListItem);
