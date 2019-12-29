// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import { addSuccess, addError } from "redux-flash-messages";
import Box from "grommet/components/Box";
import List from "grommet/components/List";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import Button from "grommet/components/Button";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import BusyIcon from "grommet/components/icons/Spinning";
import InvoiceBatchJobContainer from "./InvoiceBatchJobContainer";
import { createInvoiceAndLoadJobs } from "../actions/index";
import { intlFormSavingLabel } from "../i18n";
import { ensureState } from "redux-optimistic-ui";
import {
  jobStates,
  getInvoiceForJobSelection,
  intlCreateButton,
  intlEmptyMessage
} from "../utils/invoices";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";
import type { Invoice } from "../actions/invoices";
import type { State as ReduxState } from "../types/State";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { JobSelection } from "../utils/invoices";

type Props = {
  token: ?string,
  onClose: () => void,
  client: Client,
  jobs: Array<Job>,
  selected: JobSelection,
  isFetching: boolean,
  createInvoiceAndLoadJobs: (
    Invoice | { client: number, visits: Array<number> },
    string,
    Object
  ) => ThunkAction
};

type State = {
  selected: JobSelection
};

class ClientInvoice extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { selected } = props;
    this.state = { selected };
  }

  render() {
    const { client, jobs, selected, isFetching } = this.props;

    const jobCount = selected.size;
    const hasSelected = Array.from(selected.keys()).some((jobId: number) => {
      const selection = selected.get(jobId);
      return selection && selection.selected;
    });

    let submitForm;
    submitForm = isFetching ? (
      <Box
        direction="row"
        align="center"
        pad={{ horizontal: "medium", between: "small" }}
      >
        <BusyIcon />
        <span className="secondary">{intlFormSavingLabel}</span>
      </Box>
    ) : (
      <Box pad={{ horizontal: "medium" }}>
        <Form onSubmit={this.onSubmit}>
          <Footer pad={{ vertical: "medium" }}>
            <Button
              label={intlCreateButton}
              type={!hasSelected ? undefined : "submit"}
              primary={true}
            />
          </Footer>
        </Form>
      </Box>
    );

    return (
      <Box>
        {client.is_business
          ? client.business_name
          : `${client.first_name} ${client.last_name}`}
        <List onMore={undefined}>
          {jobs.map((job: Job, index) => {
            return (
              <InvoiceBatchJobContainer
                job={job}
                selected={new Map([[job.id, this.state.selected.get(job.id)]])}
                onChange={this.onChange}
                key={index}
              />
            );
          })}
        </List>
        <ListPlaceholder
          filteredTotal={jobCount}
          unfilteredTotal={jobCount}
          emptyMessage={intlEmptyMessage}
        />
        {submitForm}
      </Box>
    );
  }

  onChange = (selection: JobSelection) => {
    this.setState({
      selected: new Map([...this.state.selected, ...selection])
    });
  };

  onSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { client, token, createInvoiceAndLoadJobs } = this.props;
    const { selected } = this.state;

    const invoice = getInvoiceForJobSelection(client.id, selected);

    if (token) {
      createInvoiceAndLoadJobs(invoice, token, {
        business: client.business,
        limit: 200
      });
    }
  };
}

const mapStateToProps = (
  { auth, entities, jobs, invoices }: ReduxState,
  {
    onClose,
    client,
    createInvoiceAndLoadJobs
  }: {
    onClose: Function,
    client: Client,
    createInvoiceAndLoadJobs: (
      Invoice | { client: number, visits: Array<number> },
      string,
      Object
    ) => ThunkAction
  }
): Props => {
  const jobsForClient: Array<Job> = jobs.result
    .map((Id: number): Array<Job> => {
      return ensureState(entities).jobs[Id];
    })
    .filter(job => job.client === client.id);

  const jobSelection: Map<number, Job> = jobsForClient.reduce(
    (acc: Map<number, Job>, job: Job) => {
      acc.set(job.id, job);
      return acc;
    },
    new Map()
  );

  const visitSelection: Map<number, Visit> = jobsForClient
    .flatMap((job: Job) => {
      return job.visits.map((visitId: number) => {
        return ensureState(entities).visits[visitId];
      });
    })
    .reduce((acc: Map<number, Visit>, visit: Visit) => {
      acc.set(visit.id, visit);
      return acc;
    }, new Map());

  return {
    token: auth.token,
    selected: jobStates(jobSelection, visitSelection),
    jobs: jobsForClient,
    isFetching: invoices.isFetching,
    createInvoiceAndLoadJobs,
    onClose,
    client
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createInvoiceAndLoadJobs
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ClientInvoice);
