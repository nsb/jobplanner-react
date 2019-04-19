// @flow

import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import InvoiceBatchClientContainer from "./InvoiceBatchClientContainer";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";

export type Props = {
  clients: { [key: string]: Array<Client> },
  jobs: { [key: string]: Array<Job> },
  visits: { [key: string]: Array<Visit> }
};

type selectHandler = (selected: boolean) => void;
type VisitSelection = { visit: number, selected: boolean, onChange: selectHandler };
type JobSelection = { job: number, selected: boolean, onChange: selectHandler, visits: Array<VisitSelection> };
type ClientSelection = { client: number, selected: boolean, onChange: selectHandler, jobs: Array<JobSelection> };

type State = {
  selectionTree: { [key: string]: Array<ClientSelection> }
};

class InvoiceBatch extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { clients } = props;

    this.state = { selectionTree: {} };

    this.state.selectionTree = Object.keys(clients).reduce((acc, id) => {
      return { ...acc,
               [id]: { 
                 client: parseInt(id, 10),
                 selected: false,
                 onChange: (selected) => true,
                 jobs: []
                }
              }
    }, this.state.selectionTree);

  }

  render() {
    const { clients } = this.props;
    return (
      <Box>
        <List onMore={undefined}>
          {Object.keys(clients).map((id, index) => {
            return (
              <Box key={index}>
                <InvoiceBatchClientContainer client={clients[id]} />
              </Box>
            );
          })}
        </List>
        <ListPlaceholder
          filteredTotal={Object.entries(clients).length}
          unfilteredTotal={Object.entries(clients).length}
          emptyMessage="Nothing to invoice"
        />
      </Box>
    )
  }
};

export default InvoiceBatch;