// @flow

import React, { Component } from "react";
import Box from "grommet/components/Box";
import Article from "grommet/components/Article";
import Heading from "grommet/components/Heading";
import Section from "grommet/components/Section";
import Columns from "grommet/components/Columns";
import Timestamp from "grommet/components/Timestamp";
import Spinning from "grommet/components/icons/Spinning";
import type { ThunkAction } from "../types/Store";
import type { Business } from "../actions/businesses";
import type { Invoice } from "../actions/invoices";

export type Props = {
  business: Business,
  invoice: ?Invoice,
  invoiceId: number,
  isFetching: boolean,
  token: ?string,
  fetchInvoice: (string, number) => ThunkAction
};

class InvoiceDetail extends Component<Props> {
  componentDidMount() {
    const { invoice, invoiceId, token, fetchInvoice } = this.props;
    if (!invoice && token) {
      fetchInvoice(token, invoiceId);
    }
  }

  render() {
    const { invoice, isFetching } = this.props;

    if (isFetching || !invoice) {
      return (
        <Article scrollStep={true} controls={true}>
          <Section
            full={true}
            colorIndex="dark"
            // texture="url(img/ferret_background.png)"
            pad="large"
            justify="center"
            align="center"
          >
            <Spinning />
          </Section>
        </Article>
      );
    } else {
      return (
        <Article pad="none" align="start" primary={true}>
          <Box full="horizontal">
            <Section pad="medium" full="horizontal">
              Invoice #{invoice.id}
              <Columns masonry={false} maxCount={2}>
                <Box pad={{ horizontal: "none", vertical: "small" }}>
                  <Heading tag="h4" margin="none">
                    Date
                  </Heading>
                  <Timestamp fields={["date", "year"]} value={invoice.date} />
                </Box>
              </Columns>
            </Section>
            <Section full="horizontal" pad="medium">
              <Box pad={{ horizontal: "medium", vertical: "medium" }}>
                <Heading tag="h4">Summary</Heading>
              </Box>
              <Box>subtotal {invoice.total_ex_vat}</Box>
              <Box>Total {invoice.total_inc_vat}</Box>
            </Section>
          </Box>
        </Article>
      );
    }
  }
}

export default InvoiceDetail;
