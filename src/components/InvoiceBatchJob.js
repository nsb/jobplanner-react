// @flow

import React, { Component } from 'react';
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import CheckBox from 'grommet/components/CheckBox';
import InvoiceBatchVisitContainer from "./InvoiceBatchVisitContainer";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";
import type { VisitSelection } from "./InvoiceBatchVisit";

export type JobSelection = {
  [key: string]: { selected: boolean, visits: VisitSelection }
}

export type Props = {
  job: Job,
  visits: Array<Visit>,
  selected: JobSelection,
  onChange: ({ [key: string]: boolean, visits: VisitSelection }) => void
};

class InvoiceBatchClient extends Component<Props> {

  render() {
    const { job, visits, selected } = this.props;

    return (
      <ListItem
        direction="column"
        // align="start"
        separator="none"
      >
        <span>
          <CheckBox
            checked={selected[job.id.toString()].selected}
            onChange={undefined} />
          #{job.id} - {job.recurrences ? 'Recurring job' : 'One-off job'}
        </span>
        <List onMore={undefined}>
          {visits.map((visit, index) => {
            return (
              <InvoiceBatchVisitContainer
                visit={visit}
                key={index}
                selected={{ [visit.id]: selected[job.id.toString()].visits[visit.id.toString()] }} />
            )
          })}
        </List>
      </ListItem>
    )
  }
};

export default InvoiceBatchClient;