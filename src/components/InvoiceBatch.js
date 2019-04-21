// @flow

import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import InvoiceBatchClientContainer from "./InvoiceBatchClientContainer";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";
import type { ClientSelection } from "./InvoiceBatchClient";
import type { VisitSelection } from "./InvoiceBatchVisit";
import type { JobSelection } from "./InvoiceBatchJob";

export type Props = {
  clients: { [key: string]: Client },
  jobs: { [key: string]: Job },
  visits: { [key: string]: Visit }
};

type State = {
  selected: ClientSelection
}

class InvoiceBatch extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { clients } = this.props;
    this.state = { selected: {} };

    this.state.selected = Object.keys(clients).reduce((acc, clientId) => { return { ...acc, ...this._clientState(clients[clientId]) } }, {})
  }

  _visitState = (visit: Visit): VisitSelection => {
    return { [visit.id]: visit.completed }
  }

  _jobState = (job: Job): JobSelection => {
    const { visits } = this.props;
    const visitsForJob = job.visits.map((visitId) => { return visits[visitId.toString()] });
    return {
      [job.id]: {
        selected: visitsForJob.some((visit) => visit.completed),
        visits: visitsForJob.reduce((acc, visit) => { return { ...acc, ...this._visitState(visit) } }, {})
      }
    }
  }

  _clientState = (client: Client): ClientSelection => {
    const { jobs } = this.props;
    return {
      [client.id]: {
        selected: false,
        jobs: Object.keys(jobs).filter((jobId) => { return jobs[jobId].client === client.id }).map((jobId) => { return jobs[jobId] }).reduce((acc, job) => { return { ...acc, ...this._jobState(job) } }, {})
      }
    }
  }

  render() {
    const { clients } = this.props;
    return (
      <Box>
        <List onMore={undefined}>
          {Object.keys(clients).map((id, index) => {
            return (
              <InvoiceBatchClientContainer
                client={clients[id]}
                key={index}
                onChange={this.onChange}
                selected={{ [id]: this.state.selected[id] }} />
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

  onChange = (selection: ClientSelection) => {
    this.setState({ selected: selection });
  }
};

export default InvoiceBatch;