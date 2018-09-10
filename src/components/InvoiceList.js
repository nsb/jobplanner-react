// @flow

import React, { Component } from "react";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import NavControl from "./NavControl";
import InvoiceListItem from "./InvoiceListItem";
import type { ThunkAction } from "../types/Store";
import type { Business } from "../actions/businesses";
import type { Invoice } from "../actions/invoices";

export type Props = {
  business: Business,
  invoices: Array<Invoice>,
  token: ?string,
  isFetching: boolean,
  totalCount: number,
  fetchInvoices: (string, ?Object) => ThunkAction,
  intl: intlShape
};

type State = {
  searchText: string,
  offset: number,
  limit: number
};

const title = (
  <FormattedMessage
    id="invoices.title"
    description="Invoices title"
    defaultMessage="Invoices"
  />
);

class InvoiceList extends Component<Props, State> {
  state: State = {
    searchText: "",
    offset: 0,
    limit: 30
  };

  componentDidMount() {
    this.onMore();
  }

  render() {
    const { isFetching, invoices, intl, totalCount } = this.props;

    return (
      <Box>
        <Header size="large" pad={{ horizontal: "medium" }}>
          <NavControl title={title} />
        </Header>
        <List onMore={isFetching || this.state.offset >= totalCount ? undefined : this.onMore}>
          {invoices.map((invoice: Invoice, index: number) => {
            return (
              <InvoiceListItem
                key={invoice.id}
                invoice={invoice}
                index={index}
                onClick={() => {}}
              />
            );
          })}
        </List>
        <ListPlaceholder
          filteredTotal={isFetching ? null : invoices.length}
          unfilteredTotal={isFetching ? null : invoices.length}
          emptyMessage={intl.formatMessage({
            id: "invoices.emptyMessage",
            defaultMessage: "You do not have any invoices at the moment."
          })}
        />
      </Box>
    );
  }

  onMore = () => {
    const { business, token, fetchInvoices } = this.props;

    if (token) {
      fetchInvoices(token, {
        business: business.id,
        ordering: "date",
        limit: this.state.limit,
        offset: this.state.offset,
        search: this.state.searchText
      });
      this.setState({ offset: this.state.offset + this.state.limit });
    }
  };
}

export default injectIntl(InvoiceList);
