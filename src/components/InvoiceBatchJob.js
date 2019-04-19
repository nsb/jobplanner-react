// @flow

import React, { Component } from 'react';
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import CheckBox from 'grommet/components/CheckBox';
import InvoiceBatchVisitContainer from "./InvoiceBatchVisitContainer";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";

export type Props = {
  job: Job,
  visits: Array<Visit>
};

class InvoiceBatchClient extends Component<Props> {

  render() {
    const { job, visits } = this.props;

    return (
      <ListItem
        direction="column"
        // align="start"
        separator="none"
      >
        <span>
          <CheckBox
            checked={true}
            onChange={undefined} />
          #{job.id} - {job.recurrences ? 'Recurring job' : 'One-off job'}
        </span>
        <List onMore={undefined}>
          {visits.map((visit) => {
            return (
              <InvoiceBatchVisitContainer visit={visit} />
            )
          })}
        </List>
      </ListItem>
    )
  }
};

export default InvoiceBatchClient;