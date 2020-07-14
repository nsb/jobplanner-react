// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl, FormattedMessage, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import Article from "grommet/components/Article";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Anchor from "grommet/components/Anchor";
import List from "grommet/components/List";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import Button from "grommet/components/Button";
import Notification from "grommet/components/Notification";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import BusyIcon from "grommet/components/icons/Spinning";
import CloseIcon from "grommet/components/icons/base/Close";
import InvoiceBatchJobContainer from "./InvoiceBatchJobContainer";
import { AuthContext } from "../providers/authProvider";
import { createInvoiceAndLoadJobs } from "../actions/index";
import {
  intlFormSavingLabel,
  intlInvoiceAccountingSystemNotification,
} from "../i18n";
import { ensureState } from "redux-optimistic-ui";
import {
  jobStates,
  getInvoiceForJobSelection,
  intlCreateButton,
  intlEmptyMessage,
} from "../utils/invoices";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";
import type { State as ReduxState } from "../types/State";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { JobSelection } from "../utils/invoices";
import type { InvoiceRequest } from "../actions/invoices";
import type { Responsive } from "../actions/nav";

const intlHeaderText = (client: Client) => (
  <FormattedMessage
    id="clientInvoice.headerText"
    description="Client invoice header text"
    defaultMessage="New invoice for {name}"
    values={{
      name: client.is_business
        ? client.business_name
        : `${client.first_name} ${client.last_name}`,
    }}
  />
);

const intlHeadingText = (
  <FormattedMessage
    id="clientInvoice.headingText"
    description="Client invoice heading text"
    defaultMessage="Select the jobs you want to invoice"
  />
);

type Props = {
  onClose: () => void,
  client: Client,
  jobSelection: Map<number, Job>,
  visitSelection: Map<number, Visit>,
  isFetching: boolean,
  createInvoiceAndLoadJobs: (InvoiceRequest, string, Object) => ThunkAction,
  responsive: Responsive,
};

type State = {
  selected: JobSelection,
};

class ClientInvoice extends Component<Props & { intl: intlShape }, State> {
  static contextType = AuthContext;

  constructor(props: Props & { intl: intlShape }) {
    super(props);
    const { jobSelection, visitSelection } = props;
    this.state = { selected: jobStates(jobSelection, visitSelection) };
  }

  render() {
    const { client, jobSelection, isFetching, onClose } = this.props;

    const jobCount = jobSelection.size;
    const { selected } = this.state;
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
      <Article primary={true}>
        <Header size="medium" justify="between" pad={{ horizontal: "medium" }}>
          <Heading tag="h3" margin="none" strong={true}>
            {intlHeaderText(client)}
          </Heading>
          <Anchor icon={<CloseIcon />} onClick={onClose} a11yTitle="Close" />
        </Header>
        {jobSelection.size ? (
          <Box margin={{ horizontal: "medium" }}>
            <Notification
              message={intlInvoiceAccountingSystemNotification}
              status="warning"
              size="small"
            />
          </Box>
        ) : undefined}
        <Box pad="medium" full={"horizontal"}>
          <Heading tag="h3">{intlHeadingText}</Heading>
          <List onMore={undefined}>
            {Array.from(jobSelection.keys()).map((id: number, index) => {
              return (
                <InvoiceBatchJobContainer
                  job={jobSelection.get(id)}
                  selected={new Map([[id, this.state.selected.get(id)]])}
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
        </Box>
        {submitForm}
      </Article>
    );
  }

  onChange = (selection: JobSelection) => {
    this.setState({
      selected: new Map([...this.state.selected, ...selection]),
    });
  };

  onSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { client, createInvoiceAndLoadJobs, intl } = this.props;
    const { selected } = this.state;

    const invoice = getInvoiceForJobSelection(client.id, selected);

    const { getUser } = this.context;
    getUser()
      .then(({ access_token }) => {
        return createInvoiceAndLoadJobs(invoice, access_token, {
          business: client.business,
          limit: 200,
        });
      })
      .then(() => {
        addSuccess({ text: intl.formatMessage({ id: "flash.saved" }) });
      })
      .catch(() => {
        addError({ text: intl.formatMessage({ id: "flash.error" }) });
      });
  };
}

const mapStateToProps = (
  { entities, jobs, invoices, nav }: ReduxState,
  {
    onClose,
    client,
    createInvoiceAndLoadJobs,
  }: {
    onClose: Function,
    client: Client,
    createInvoiceAndLoadJobs: (InvoiceRequest, string, Object) => ThunkAction,
  }
): Props => {
  const jobsForClient: Array<Job> = jobs.result
    .map((Id: number): Array<Job> => {
      return ensureState(entities).jobs[Id];
    })
    .filter((job) => job.client === client.id && job.visits.length);

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
    isFetching: invoices.isFetching,
    responsive: nav.responsive,
    jobSelection,
    visitSelection,
    createInvoiceAndLoadJobs,
    onClose,
    client,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createInvoiceAndLoadJobs,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(ClientInvoice));
