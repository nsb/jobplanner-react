// @flow

import React, { Component } from 'react';
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import CheckBox from 'grommet/components/CheckBox';
import InvoiceBatchJobContainer from "./InvoiceBatchJobContainer";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";

export type Props = {
    key: number,
    client: Client,
    jobs: Array<Job>
};

class InvoiceBatchClient extends Component<Props> {

  render() {
    const { client, jobs, key } = this.props;

    return (
      <ListItem
        direction="column"
        align="start"
        separator={key === 0 ? "horizontal" : "bottom"}
      >
        <span>
          <CheckBox
            checked={true}
            onChange={undefined}
          />
          {client.is_business ? client.business_name : `${client.first_name} ${client.last_name}`}
        </span>
        <List onMore={undefined}>
          {jobs.map((job) => {
            return (
              <InvoiceBatchJobContainer job={job} />
            )
          })}
        </List>
      </ListItem>
    )  
  }
};

export default InvoiceBatchClient;