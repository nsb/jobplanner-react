// @flow

import React, { Component } from "react";
import moment from "moment";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import Search from "grommet/components/Search";
import FilterControl from "grommet-addons/components/FilterControl";
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import NavControl from "./NavControl";
import VisitsReportFilter from "./VisitsReportFilter";
import type { FilterValues } from "./VisitsReportFilter";
import type { Business } from "../actions/businesses";
import type { Visit } from "../actions/visits";
import type { Employee } from "../actions/employees";

type Props = {
  business: Business,
  visits: Array<Visit>,
  isFetching?: boolean,
  searchText?: string,
  onSearch: (SyntheticInputEvent<*>) => void,
  onMore: () => void,
  intl: intlShape,
  employees: Array<Employee>
};

type State = {
  filterActive: boolean,
  filterValues: FilterValues
};

class VisitsReport extends Component<Props, State> {
  state: State = {
    filterActive: true,
    filterValues: {
      begins: moment().subtract(1, "months"),
      ends: new Date(),
      complete: true,
      incomplete: false,
      assigned: []
    }
  };

  render() {
    const {
      searchText,
      onSearch,
      onMore,
      isFetching,
      intl,
      visits,
      employees
    } = this.props;
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
          <Search
            inline={true}
            fill={true}
            size="medium"
            placeHolder="Search"
            value={searchText}
            onDOMChange={onSearch}
          />
          <FilterControl onClick={this._onToggleFilter} />
        </Header>
        <List onMore={isFetching ? onMore : undefined}>
          {visits.map((visit: Visit, index: number) => {
            return <div key={visit.id}>{visit.client_name}</div>;
          })}
        </List>
        <ListPlaceholder
          filteredTotal={isFetching ? null : visits.length}
          unfilteredTotal={isFetching ? null : visits.length}
          emptyMessage={intl.formatMessage({
            id: "visits.emptyMessage",
            defaultMessage: "No visits found."
          })}
        />
        {filterLayer}
      </Box>
    );
  }

  _onToggleFilter = () => {
    this.setState({ filterActive: !this.state.filterActive });
  };

  onFilterSubmit = filterValues => {
    this.setState({ filterActive: false, filterValues });
    console.log(filterValues);
  };
}

export default injectIntl(VisitsReport);
