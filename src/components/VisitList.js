// @flow

import React, { Component } from "react";
import { injectIntl, intlShape } from "react-intl";
import Box from "grommet/components/Box";
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import VisitLayerContainer from "./VisitLayerContainer";
import VisitListItemContainer from "./VisitListItemContainer";
import type { Visit } from "../actions/visits";

type Props = {
  visits: Array<Visit>,
  isFetching?: boolean,
  onMore: () => void,
  intl: intlShape
};

type State = {
  selected?: Visit
};

class VisitList extends Component<Props, State> {
  state = {
    selected: undefined
  };

  render() {
    const { visits = [], isFetching = true, onMore, intl } = this.props;

    let visitLayer;
    if (this.state.selected) {
      visitLayer = (
        <VisitLayerContainer
          visit={this.state.selected}
          onClose={this.onClose}
        />
      );
    }

    return (
      <Box>
        <List onMore={isFetching ? undefined : onMore}>
          {visits.map((visit: Visit, index: number) => {
            return (
              <VisitListItemContainer
                key={visit.id}
                visit={visit}
                index={index}
                onClick={e => this.onClick(visit)}
              />
            );
          })}
        </List>
        <ListPlaceholder
          filteredTotal={isFetching ? null : visits.length}
          unfilteredTotal={isFetching ? null : visits.length}
          emptyMessage={intl.formatMessage({
            id: "visits.emptyMessage",
            defaultMessage: "You do not have any visits at the moment."
          })}
        />
        {visitLayer}
      </Box>
    );
  }

  onClick = (visit: Visit) => {
    this.setState({ selected: visit });
  };

  onClose = () => {
    this.setState({ selected: undefined });
  };
}

export default injectIntl(VisitList);
