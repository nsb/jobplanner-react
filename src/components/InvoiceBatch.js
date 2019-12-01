// @flow

import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from "react-intl";
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import List from "grommet/components/List";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import Button from "grommet/components/Button";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import BusyIcon from 'grommet/components/icons/Spinning';
import Notification from 'grommet/components/Notification';
import NavControl from './NavControl';
import InvoiceBatchClientContainer from "./InvoiceBatchClientContainer";
import { intlFormSavingLabel } from "../i18n";
import type { Business } from "../actions/businesses";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";
import type { ClientSelection } from "./InvoiceBatchClient";
import type { VisitSelection } from "./InvoiceBatchVisit";
import type { JobSelection } from "./InvoiceBatchJob";
import type { ThunkAction } from "../types/Store";

const intlTitle = (
  <FormattedMessage
    id="invoices.title"
    description="Invoices title"
    defaultMessage="Invoices"
  />
)

const intlNone = (
  <FormattedMessage
    id="invoices.none"
    description="Invoices none selection"
    defaultMessage="None"
  />
)

const intlAll = (
  <FormattedMessage
    id="invoices.all"
    description="Invoices all selection"
    defaultMessage="All"
  />
)

const intlEmptyMessage = (
  <FormattedMessage
    id="invoices.emptyMessage"
    description="Invoices empty message"
    defaultMessage="Nothing to invoice"
  />
)

const intlCreateButton = (
  <FormattedMessage
    id="invoices.createButton"
    description="Invoices create button"
    defaultMessage="Create invoices"
  />
)

const intlAccountingSystem = (
  <FormattedMessage
    id="invoices.createdAccounting"
    description="Message about invoices in accounting system."
    defaultMessage="Invoices will be created in your accounting system. Please make sure you have connected your accounting system via our add-ons."
  />
)

export type Props = {
  business: Business,
  clients: Map<number, Client>,
  jobs: Map<number, Job>,
  visits: Map<number, Visit>,
  createInvoiceAndLoadJobs: (Array<{ client: number, visits: Array<number> }>, string, Object) => ThunkAction,
    token: ?string,
      isFetching: boolean
};

type State = {
  selected: ClientSelection
}

class InvoiceBatch extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { clients } = this.props;
    this.state = { selected: new Map() };

    this.state.selected = Array.from(clients.keys()).reduce(
      (acc, clientId: number) => new Map([...acc, ...this._clientState(clients.get(clientId))]),
      new Map()
    );
  }

  _visitState = (visit: ?Visit): VisitSelection => visit ? new Map([[visit.id, visit.completed]]) : new Map();

  _jobState = (job: Job): JobSelection => {
    const { visits } = this.props;
    const visitsForJob: Array<Visit> = [];
    job.visits.forEach(visitId => {
      const visit = visits.get(visitId);
      if (visit) {
        visitsForJob.push(visit);
      }
    });

    return new Map(
      [[job.id, {
        selected: visitsForJob.some(visit => visit && visit.completed),
        visits: visitsForJob.reduce((acc, visit) => new Map(
          [...acc, ...this._visitState(visit)]), new Map()
        )
      }]]
    )
  }

  _clientState = (client: ?Client): ClientSelection => {
    const { jobs } = this.props;

    if (client) {
      const jobSelections: Array<JobSelection> = []
      Array.from(jobs.keys()).forEach((jobId: number) => {
        const job = jobs.get(jobId);
        if (job) {
          jobSelections.push(this._jobState(job))
        }
      })

      return new Map(
        [[client.id, {
          selected: false,
          jobs: jobSelections.reduce(
            (acc, jobSelection: JobSelection) => new Map([...acc, ...jobSelection]),
            new Map()
          )
        }]]
      )
    } else {
      return new Map();
    }
  }

  render() {
    const { clients, isFetching } = this.props;
    const { selected } = this.state;
    const clientCount = clients.size
    const hasSelected = Array.from(selected.keys()).some(clientId => { const selection = selected.get(clientId); return selection && selection.selected })

    let submitForm;
    if (clientCount) {
      submitForm = isFetching ? (
        <Box direction="row" align="center"
          pad={{ horizontal: 'medium', between: 'small' }}>
          <BusyIcon /><span className="secondary">{intlFormSavingLabel}</span>
        </Box>
      ) : (
          <Box pad={{ horizontal: "medium" }}>
            <Form onSubmit={this.onSubmit}>
              <Footer pad={{ "vertical": "medium" }}>
                <Button label={intlCreateButton}
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
          <NavControl title={intlTitle} />
          <Box direction="row">
            <Button label={intlNone} onClick={() => this.onAllOrNone(false)} accent={true} />
            <Button label={intlAll} onClick={() => this.onAllOrNone(true)} accent={true} />
          </Box>
        </Header>
        {clients.size ? <Notification message={intlAccountingSystem} status='warning' size="small" /> : undefined}
        <List onMore={undefined}>
          {Array.from(clients.keys()).map((id: number, index) => {
            return (
              <InvoiceBatchClientContainer
                client={clients.get(id)}
                key={index}
                onChange={this.onChange}
                selected={new Map([[id, this.state.selected.get(id)]])} />
            );
          })}
        </List>
        <ListPlaceholder
          filteredTotal={clientCount}
          unfilteredTotal={clientCount}
          emptyMessage={intlEmptyMessage}
        />
        {submitForm}
      </Box>
    )
  }

  onChange = (selection: ClientSelection) => {
    this.setState({ selected: new Map([...this.state.selected, ...selection]) });
  }

  onAllOrNone = (selection: boolean) => {
    const { selected } = this.state;

    const newSelected = Array.from(selected.keys()).reduce((acc, clientId) => {
      if (clientId) {
        acc.set(clientId, { ...selected.get(clientId), selected: selection });
      }
      return acc;
    }, new Map())

    this.setState({ selected: newSelected });
  }

  onSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { selected } = this.state;

    let invoices: Array<{ client: number, visits: Array<number> }> = [];
    let selectedClientIds = Array.from(selected.keys()).filter((clientId) => { const selection = selected.get(clientId); return selection && selection.selected });

    for (let clientId of selectedClientIds) {
      let visitIds = [];
      const clientSelection = selected.get(clientId);
      let jobs = (clientSelection && clientSelection.jobs) || new Map();
      let selectedJobIds = Array.from(jobs.keys()).filter((jobId) => { const job = jobs.get(jobId); return job && job.selected })
      for (let jobId of selectedJobIds) {
        const jobSelection = clientSelection && clientSelection.jobs.get(jobId);
        let visits = (jobSelection && jobSelection.visits) || new Map();
        let selectedVisitIds = Array.from(visits.keys()).filter((visitId) => visits.get(visitId));
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

export default injectIntl(InvoiceBatch);