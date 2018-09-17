// @flow

import React, { Component } from "react";
import Article from "grommet/components/Article";
import Section from "grommet/components/Section";
import Timestamp from "grommet/components/Timestamp";
import Spinning from "grommet/components/icons/Spinning";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import type { ThunkAction } from "../types/Store";
import type { Invoice } from "../actions/invoices";
import type { Visit } from "../actions/visits";

export type Props = {
  invoice: Invoice,
  visits: Array<Visit>,
  isFetching: boolean,
  token: ?string,
  fetchVisits: (string, Object) => ThunkAction
};

class InvoiceDetailVisitList extends Component<Props> {
  componentDidMount() {
    const { invoice, token, fetchVisits } = this.props;
    if (token) {
      fetchVisits(token, { id__in: invoice.visits.join(",") });
    }
  }

  render() {
    const { visits, isFetching } = this.props;

    if (isFetching) {
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
        <div>
          <List onMore={undefined}>
            {visits.map((visit, index) => {
              return (
                <ListItem key={visit.id} index={index}>
                  <span><Timestamp fields={["date", "year"]} value={visit.begins} /></span>
                  <span>{visit.total_cost}</span>
                </ListItem>
              );
            })}
          </List>
          <ListPlaceholder
            filteredTotal={isFetching ? null : visits.length}
            unfilteredTotal={isFetching ? null : visits.length}
            emptyMessage="No visits."
          />
        </div>
      );
    }
  }
}

export default InvoiceDetailVisitList;
