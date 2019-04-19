// @flow

import React, { Component } from 'react';
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import Box from 'grommet/components/Box';
import InvoiceBatchJobContainer from "./InvoiceBatchJobContainer";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";

export type Props = {
    client: Client,
    jobs: Array<Job>
};

class InvoiceBatchClient extends Component<Props> {

  render() {
    const { client, jobs } = this.props;

    return (
      <ListItem
        direction="row"
        align="start"
        justify="between"
        // separator={index === 0 ? "horizontal" : "bottom"}
        pad={{ horizontal: "medium", vertical: "small", between: "medium" }}
        responsive={true}
        onClick={undefined}
        selected={false}
      >
        <Box>{client.first_name}</Box>
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