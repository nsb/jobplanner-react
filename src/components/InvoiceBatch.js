// @flow

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import List from "grommet/components/List";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import Button from "grommet/components/Button";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import NavControl from './NavControl';
import InvoiceBatchClientContainer from "./InvoiceBatchClientContainer";
import type { Business } from "../actions/businesses";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";
import type { ClientSelection } from "./InvoiceBatchClient";
import type { VisitSelection } from "./InvoiceBatchVisit";
import type { JobSelection } from "./InvoiceBatchJob";
import type { ThunkAction } from "../types/Store";

const title = (
  <FormattedMessage
    id="invoices.title"
    description="Invoices title"
    defaultMessage="Invoices"
  />
)

export type Props = {
  business: Business,
  clients: { [key: string]: Client },
  jobs: { [key: string]: Job },
  visits: { [key: string]: Visit },
  createInvoiceAndLoadJobs: (Array<{ client: number, visits: Array<number> }>, string, Object) => ThunkAction,
  token: ?string
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
        jobs: Object.keys(jobs).filter(
          (jobId) => { return jobs[jobId].client === client.id }).map(
            (jobId) => { return jobs[jobId] }).reduce(
              (acc, job) => { return { ...acc, ...this._jobState(job) } }, {})
      }
    }
  }

  render() {
    const { clients } = this.props;
    const { selected } = this.state;
    const clientCount = Object.entries(clients).length
    const hasSelected = Object.keys(selected).some(clientId => selected[clientId].selected)

    let submitForm;
    if (clientCount) {
      submitForm = (
        <Box pad={{ horizontal: "medium" }}>
          <Form onSubmit={this.onSubmit}>
            <Footer pad={{ "vertical": "medium" }}>
              <Button label='Create invoices'
                type={(!hasSelected) ? undefined : 'submit'}
                primary={true}
              />
            </Footer>
          </Form>
        </Box>
      )
    }

    return (
      <Box>
        <Header size="large" pad={{ horizontal: 'medium' }}>
          <NavControl title={title} />
          <Box direction="row">
            <Button label="None" onClick={() => this.onAllOrNone(false)} accent={true} />
            <Button label="All" onClick={() => this.onAllOrNone(true)} accent={true} />
          </Box>
        </Header>
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
          filteredTotal={clientCount}
          unfilteredTotal={clientCount}
          emptyMessage="Nothing to invoice"
        />
        {submitForm}
      </Box>
    )
  }

  onChange = (selection: ClientSelection) => {
    this.setState({ selected: { ...this.state.selected, ...selection } });
  }

  onAllOrNone = (selection: boolean) => {
    const { selected } = this.state;

    const newSelected = Object.keys(selected).reduce((acc, clientId) => {
      acc[clientId].selected = selection;
      return acc;
    }, { ...selected })

    this.setState({ selected: newSelected });
  }

  onSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { selected } = this.state;

    let invoices: Array<{ client: number, visits: Array<number> }> = [];
    let selectedClientIds = Object.keys(selected).filter((clientId) => { return selected[clientId].selected });

    for (let clientId of selectedClientIds) {
      let visitIds = [];
      let jobs = selected[clientId].jobs;
      let selectedJobIds = Object.keys(jobs).filter((jobId) => { return jobs[jobId].selected })
      for (let jobId of selectedJobIds) {
        let visits = selected[clientId].jobs[jobId].visits;
        let selectedVisitIds = Object.keys(visits).filter((visitId) => { return visits[visitId] });
        visitIds.push(...selectedVisitIds);
      }
      invoices.push({ client: parseInt(clientId, 10), visits: visitIds.map((id) => parseInt(id, 10)) });

    }

    const { createInvoiceAndLoadJobs, token, business } = this.props;

    if (token) {
      createInvoiceAndLoadJobs(invoices, token, { business: business.id, limit: 200 });
    }
  }
};

export default InvoiceBatch;