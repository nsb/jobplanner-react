// @flow

import React, { Component } from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import Search from "grommet/components/Search";
import Anchor from "grommet/components/Anchor";
import Button from "grommet/components/Button";
import AddIcon from "grommet/components/icons/base/Add";
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import NavControl from "./NavControl";
import type { Business } from "../actions/businesses";
import type { Visit } from "../actions/visits";

type Props = {
  business: Business,
  visits: Array<Visit>,
  isFetching?: boolean,
  searchText?: string,
  onSearch: (SyntheticInputEvent<*>) => void,
  onMore: () => void,
  intl: intlShape
};

type State = {
  filterActive: boolean
};

class VisitsReport extends Component<Props, State> {
  render() {
    const {
      searchText,
      onSearch,
      business,
      onMore,
      isFetching,
      intl,
      visits
    } = this.props;
    return (
      <Box>
        <Header size="large" pad={{ horizontal: "medium" }}>
          <Title responsive={false}>
            <NavControl />
            <FormattedMessage
              id="clients.title"
              description="Clients title"
              defaultMessage="Clients"
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
          <Anchor
            icon={<AddIcon />}
            path={`/${business.id}/clients/add`}
            a11yTitle={`Add business`}
          />
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
          addControl={
            <Button
              icon={<AddIcon />}
              label="Add visit"
              primary={true}
              a11yTitle={`Add visit`}
              path={`/${business.id}/visits/add`}
            />
          }
        />
      </Box>
    );
  }

  _onToggleFilter = () => {
    this.setState({ filterActive: !this.state.filterActive });
  };
}

export default injectIntl(VisitsReport);
