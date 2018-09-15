// @flow

import React, { Component } from "react";
import ListItem from "grommet/components/ListItem";
import Timestamp from "grommet/components/Timestamp";
import InvoiceListItemClient from "./InvoiceListItemClientContainer";
import type { Invoice } from "../actions/invoices";

type Props = {
  invoice: Invoice,
  index: number,
  onClick: (SyntheticInputEvent<*>) => void
};

class InvoiceListItem extends Component<Props> {
  render() {
    const { invoice, index, onClick } = this.props;
    return (
      <ListItem
        direction="row"
        align="center"
        justify="between"
        separator={index === 0 ? "horizontal" : "bottom"}
        pad={{ horizontal: "medium", vertical: "small", between: "medium" }}
        responsive={false}
        onClick={onClick}
        selected={false}
      >
        <span>#{invoice.id}</span>
        <span>
          <InvoiceListItemClient clientId={invoice.client} />
        </span>
        <span>
          <Timestamp fields={["date", "year"]} value={invoice.date} />
        </span>
        <span>
          {invoice.total_inc_vat}
        </span>
      </ListItem>
    );
  }
}

export default InvoiceListItem;
