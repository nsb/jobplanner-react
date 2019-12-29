// @flow

import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import List from "grommet/components/List";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import Button from "grommet/components/Button";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import BusyIcon from "grommet/components/icons/Spinning";
import Notification from "grommet/components/Notification";
import NavControl from "./NavControl";
import InvoiceBatchClientContainer from "./InvoiceBatchClientContainer";
import { intlFormSavingLabel } from "../i18n";
import {
  batchState,
  getInvoiceForJobSelection,
  intlCreateButton
} from "../utils/invoices";
import type { Business } from "../actions/businesses";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";
import type { InvoiceRequest } from "../actions/invoices";
import type { ClientSelection } from "../utils/invoices";
import type { ThunkAction } from "../types/Store";

const intlTitle = (
  <FormattedMessage
    id="invoices.title"
    description="Invoices title"
    defaultMessage="Invoices"
  />
);

const intlNone = (
  <FormattedMessage
    id="invoices.none"
    description="Invoices none selection"
    defaultMessage="None"
  />
);

const intlAll = (
  <FormattedMessage
    id="invoices.all"
    description="Invoices all selection"
    defaultMessage="All"
  />
);

const intlEmptyMessage = (
  <FormattedMessage
    id="invoices.emptyMessage"
    description="Invoices empty message"
    defaultMessage="Nothing to invoice"
  />
);

const intlAccountingSystem = (
  <FormattedMessage
    id="invoices.createdAccounting"
    description="Message about invoices in accounting system."
    defaultMessage="Invoices will be created in your accounting system. Please make sure you have connected your accounting system via our add-ons."
  />
);

export type Props = {
  business: Business,
  clients: Map<number, Client>,
  jobs: Map<number, Job>,
  visits: Map<number, Visit>,
  createInvoiceAndLoadJobs: (
    InvoiceRequest | Array<InvoiceRequest>,
    string,
    Object
  ) => ThunkAction,
  token: ?string,
  isFetching: boolean
};

type State = {
  selected: ClientSelection
};

class InvoiceBatch extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { clients, jobs, visits } = this.props;
    this.state = { selected: new Map() };
    this.state.selected = batchState(clients, jobs, visits);
  }

  render() {
    const { clients, isFetching } = this.props;
    const { selected } = this.state;
    const clientCount = clients.size;
    const hasSelected = Array.from(selected.keys()).some((clientId: number) => {
      const selection = selected.get(clientId);
      return selection && selection.selected;
    });

    let submitForm;
    if (clientCount) {
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
    }

    return (
      <Box>
        <Header size="large" pad={{ horizontal: "medium" }}>
          <NavControl title={intlTitle} />
          <Box direction="row">
            <Button
              label={intlNone}
              onClick={() => this.onAllOrNone(false)}
              accent={true}
            />
            <Button
              label={intlAll}
              onClick={() => this.onAllOrNone(true)}
              accent={true}
            />
          </Box>
        </Header>
        {clients.size ? (
          <Notification
            message={intlAccountingSystem}
            status="warning"
            size="small"
          />
        ) : (
          undefined
        )}
        <List onMore={undefined}>
          {Array.from(clients.keys()).map((id: number, index) => {
            return (
              <InvoiceBatchClientContainer
                client={clients.get(id)}
                key={index}
                onChange={this.onChange}
                selected={new Map([[id, this.state.selected.get(id)]])}
              />
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
    );
  }

  onChange = (selection: ClientSelection) => {
    this.setState({
      selected: new Map([...this.state.selected, ...selection])
    });
  };

  onAllOrNone = (selection: boolean) => {
    const { selected } = this.state;

    const newSelected = Array.from(selected.keys()).reduce(
      (acc, clientId: number) => {
        if (clientId) {
          const selectedClient = selected.get(clientId);
          if (selectedClient) {
            acc.set(clientId, { ...selectedClient, selected: selection });
          }
        }
        return acc;
      },
      new Map()
    );

    this.setState({ selected: newSelected });
  };

  onSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { selected } = this.state;

    let invoices: Array<InvoiceRequest> = [];
    let selectedClientIds = Array.from(selected.keys()).filter(
      (clientId: number) => {
        const selection = selected.get(clientId);
        return selection && selection.selected;
      }
    );

    for (let clientId: number of selectedClientIds) {
      const clientSelection = selected.get(clientId);
      if (clientSelection) {
        let jobs = (clientSelection && clientSelection.jobs) || new Map();
        invoices.push(getInvoiceForJobSelection(clientId, jobs));
      }
    }

    const { createInvoiceAndLoadJobs, token, business } = this.props;

    if (token) {
      createInvoiceAndLoadJobs(invoices, token, {
        business: business.id,
        limit: 200
      });
    }
  };
}

export default injectIntl(InvoiceBatch);
