// @flow

import React, { Component } from 'react';
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import CheckBox from 'grommet/components/CheckBox';
import InvoiceBatchJobContainer from "./InvoiceBatchJobContainer";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";
import type { JobSelection } from "./InvoiceBatchJob";

export type ClientSelection = {
  [key: string]: { selected: Boolean, jobs: JobSelection }
}

export type Props = {
  client: Client,
  jobs: Array<Job>,
  onChange: Function,
  selected: ClientSelection
};

class InvoiceBatchClient extends Component<Props> {

  render() {
    const { client, jobs, selected } = this.props;

    return (
      <ListItem
        direction="column"
        align="start"
      >
        <span>
          <CheckBox
            checked={selected[client.id.toString()].selected}
            onChange={undefined}
          />
          {client.is_business ? client.business_name : `${client.first_name} ${client.last_name}`}
        </span>
        <List onMore={undefined}>
          {jobs.map((job, index) => {
            return (
              <InvoiceBatchJobContainer job={job} selected={{ [job.id]: selected[client.id.toString()].jobs[job.id.toString()] }} key={index} />
            )
          })}
        </List>
      </ListItem>
    )
  }
};

export default InvoiceBatchClient;