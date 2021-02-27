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
import Timestamp from "grommet/components/Timestamp";
import visitsApi from "../api";
import NavControl from "./NavControl";
import VisitsReportFilter from "./VisitsReportFilter";
import VisitsReportListItem from "./VisitsReportListItem";
import { AuthContext } from "../providers/authProvider";
import type { FilterValues } from "./VisitsReportFilter";
import type { Business } from "../actions/businesses";
import type { Visit, VisitsResponse } from "../actions/visits";
import type { Employee } from "../actions/employees";

const intlCompleted = (
  <FormattedMessage
    id="visitsReport.filterCompleted"
    description="Visits report filter completed"
    defaultMessage="Completed"
  />
);

const intlIncomplete = (
  <FormattedMessage
    id="visitsReport.filterIncomplete"
    description="Visits report filter incomplete"
    defaultMessage="Incomplete"
  />
);

const intlCount = (count: number, total: number) => (
  <FormattedMessage
    id="visitsReport.filterCount"
    description="Visits report filter count"
    defaultMessage="Showing {count} of {total} visits."
    values={{ count, total }}
  />
);

const intlEmptyMessage = (
  <FormattedMessage
    id="visitsReport.emptyMessage"
    description="Visits report empty message"
    defaultMessage="No visits found."
  />
);

export type Props = {
  business: Business,
  employees: Array<Employee>
};

type State = {
  offset: number,
  limit: number,
  count: number,
  visits: Array<Visit>,
  filterActive: boolean,
  filterValues: FilterValues,
  isFetching: boolean
};

class VisitsReport extends Component<Props & { intl: intlShape }, State> {
  state: State = {
    offset: 0,
    limit: 30,
    count: 0,
    visits: [],
    filterActive: false,
    filterValues: {
      begins: moment()
        .subtract(1, "months")
        .toDate(),
      ends: new Date(),
      complete: true,
      incomplete: false,
      assigned: undefined
    },
    isFetching: false
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.onMore();
  }

  render() {
    const { employees } = this.props;
    const {
      filterActive,
      filterValues,
      visits,
      count,
      isFetching
    } = this.state;

    let filterLayer;
    if (filterActive) {
      filterLayer = (
        <VisitsReportFilter
          onClose={this._onToggleFilter}
          employees={employees.filter(employee => employee.is_active)}
          onSubmit={this.onFilterSubmit}
          filterValues={filterValues}
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
        <Box pad={{ horizontal: "medium" }}>
          <Box direction="row">
            <Box margin={{ right: "small" }}>
              <Timestamp
                fields={["date", "year"]}
                value={filterValues.begins}
              />
            </Box>
            -
            <Box margin={{ left: "small" }}>
              <Timestamp fields={["date", "year"]} value={filterValues.ends} />
            </Box>
          </Box>
          {filterValues.complete && intlCompleted}
          {filterValues.incomplete && intlIncomplete}
          {filterValues.assigned && filterValues.assigned.label}
          {isFetching ? undefined : intlCount(visits.length, count)}
        </Box>
        <List
          onMore={this.state.offset < this.state.count ? this.onMore : null}
        >
          {this.state.visits.map((visit: Visit, index: number) => {
            return (
              <VisitsReportListItem
                visit={visit}
                key={index}
                index={index}
                assigned={employees.filter(employee =>
                  visit.assigned.includes(employee.id)
                )}
              />
            );
          })}
        </List>
        <ListPlaceholder
          filteredTotal={
            this.state.isFetching ? null : this.state.visits.length
          }
          unfilteredTotal={
            this.state.isFetching ? null : this.state.visits.length
          }
          emptyMessage={intlEmptyMessage}
        />
        {filterLayer}
      </Box>
    );
  }

  onMore = () => {
    const { business } = this.props;
    const { limit, offset, filterValues } = this.state;
    let filters: {
      limit: number,
      offset: number,
      begins__gte: Date,
      ends__lte: Date,
      assigned?: number,
      completed?: boolean,
      ordering: string
    } = {
      limit: limit,
      offset: offset,
      begins__gte: filterValues.begins,
      ends__lte: filterValues.ends,
      ordering: "begins"
    };
    if (filterValues.complete !== filterValues.incomplete) {
      filters.completed = filterValues.complete && !filterValues.incomplete;
    }
    if (filterValues.assigned) {
      filters.assigned = filterValues.assigned.value;
    }

    this.setState({ isFetching: true, offset: this.state.offset + this.state.limit }, () => {
      const { getUser } = this.context;
      getUser()
        .then(({ access_token }) => {
          return visitsApi.getAll("visits", access_token, {
            ...filters,
            business: business.id
          });
        })
        .then((responseVisits: VisitsResponse) => {
          this.setState({
            visits: union(this.state.visits, responseVisits.results),
            count: responseVisits.count,
            // offset: this.state.offset + this.state.limit,
            isFetching: false
          });
        })
        .catch((error: string) => {
          throw error;
        });
    });
  };

  _onToggleFilter = () => {
    this.setState({ filterActive: !this.state.filterActive });
  };

  onFilterSubmit = filterValues => {
    this.setState(
      { filterActive: false, filterValues, offset: 0, count: 0, visits: [] },
      this.onMore
    );
  };
}

export default injectIntl(VisitsReport);
