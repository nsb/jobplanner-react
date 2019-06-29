// @flow

import React, { Component } from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import ListItem from "grommet/components/ListItem";
import Timestamp from "grommet/components/Timestamp";
import type { Visit } from "../actions/visits";
import type { Employee } from "../actions/employees";

const intlAssigned = (names: Array<string>) => (
  <FormattedMessage
    id="visitsReportListItem.assigned"
    description="Visits report list item assigned"
    defaultMessage="Assigned to {names}"
    values={{names: names.join(", ")}}
  />
)

const intlNotAssigned = (
  <FormattedMessage
    id="visitsReportListItem.notAssigned"
    description="Visits report list item not assigned"
    defaultMessage="Not assigned"
  />
)

type Props = {
  visit: Visit,
  assigned: Array<Employee>,
  index: number
};

class VisitsReportListItem extends Component<Props & { intl: intlShape }> {
  render() {
    const { visit, assigned, index } = this.props;

    const assignedNames = assigned.length ? intlAssigned(assigned.map(employee => employee.first_name)) : intlNotAssigned;
    
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

export default injectIntl(VisitsReportListItem);
