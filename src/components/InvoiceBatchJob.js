// @flow

import React, { Component } from 'react';
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import Box from 'grommet/components/Box';
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
    console.log('*********', visits);

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
        <Box>{job.id}</Box>
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