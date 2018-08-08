// @flow

import React, { Component } from "react";
import moment from "moment";
import { union } from "lodash/array";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import FilterControl from "grommet-addons/components/FilterControl";
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import visitsApi from "../api";
import NavControl from "./NavControl";
import VisitsReportFilter from "./VisitsReportFilter";
import type { FilterValues } from "./VisitsReportFilter";
import type { Business } from "../actions/businesses";
import type { Visit, VisitsResponse } from "../actions/visits";
import type { Employee } from "../actions/employees";

type Props = {
  business: Business,
  intl: intlShape,
  employees: Array<Employee>,
  token: ?string
};

type State = {
  offset: number,
  limit: number,
  count: number,
  visits: Array<Visit>,
  filterActive: boolean,
  filterValues: FilterValues
};

class VisitsReport extends Component<Props, State> {
  state: State = {
    offset: 0,
    limit: 30,
    count: 0,
    visits: [],
    filterActive: true,
    filterValues: {
      begins: moment().subtract(1, "months"),
      ends: new Date(),
      complete: true,
      incomplete: false,
      assigned: []
    }
  };

  componentDidMount(prevProps: Props) {
    this.onMore();
  }

  render() {
    const { intl, employees } = this.props;
    const { filterActive } = this.state;

    let filterLayer;
    if (filterActive) {
      filterLayer = (
        <VisitsReportFilter
          onClose={this._onToggleFilter}
          employees={employees}
          onSubmit={this.onFilterSubmit}
          filterValues={this.state.filterValues}
        />
      );
    }

    return (
      <Box>
        <Header size="large" pad={{ horizontal: "medium" }}>
          <Title responsive={false}>
            <NavControl />
            <FormattedMessage
              id="visitsreport.title"
              description="Visits Report title"
              defaultMessage="Visits Report"
            />
          </Title>
          <FilterControl onClick={this._onToggleFilter} />
        </Header>
        <List
          onMore={
            this.state.offset < this.state.count ? this.onMore : null
          }
        >
          {this.state.visits.map((visit: Visit, index: number) => {
            return <div key={visit.id}>{visit.client_name}</div>;
          })}
        </List>
        <ListPlaceholder
          filteredTotal={false ? null : this.state.visits.length}
          unfilteredTotal={false ? null : this.state.visits.length}
          emptyMessage={intl.formatMessage({
            id: "visits.emptyMessage",
            defaultMessage: "No visits found."
          })}
        />
        {filterLayer}
      </Box>
    );
  }

  onMore = () => {
    const { token } = this.props;
    if (token) {
      visitsApi
        .getAll("visits", token, {
          limit: this.state.limit,
          offset: this.state.offset
        })
        .then((responseVisits: VisitsResponse) => {
          this.setState({
            visits:  union(this.state.visits, responseVisits.results),
            count: responseVisits.count,
            offset: this.state.offset + this.state.limit
          });
        })
        .catch((error: string) => {
          throw error;
        });
    }
  };

  _onToggleFilter = () => {
    this.setState({ filterActive: !this.state.filterActive });
  };

  onFilterSubmit = filterValues => {
    this.setState({ filterActive: false, filterValues });
    console.log(filterValues);
  };
}

export default injectIntl(VisitsReport);
