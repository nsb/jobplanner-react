// @flow

import React, { Component } from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Box from "grommet/components/Box";
import List from "grommet/components/List";
import Heading from "grommet/components/Heading";
import Timestamp from "grommet/components/Timestamp";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import VisitLayerContainer from "./VisitLayerContainer";
import VisitListItemContainer from "./VisitListItemContainer";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";

const intlEmpytMessage = (
  <FormattedMessage
    id="visitList.emptyMessage"
    description="Visit list empty message"
    defaultMessage="You do not have any visits at the moment."
  />
)

type Props = {
  visits: { [key: string]: Array<Visit> },
  job?: Job,
  isFetching: boolean,
  onMore: () => void
};

type State = {
  selected?: Visit
};

class VisitList extends Component<Props & { intl: intlShape }, State> {
  state = {
    selected: undefined
  };

  render() {
    const { visits, isFetching, job, onMore } = this.props;

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
          {Object.keys(visits).map((date, index) => {
            return (
              <Box key={index}>
                <Box pad={{ horizontal: "small", vertical: "none" }}>
                  <Heading tag="h6" margin="small">
                    <Timestamp fields={["month-full"]} value={date} />
                  </Heading>
                </Box>
                <List onMore={undefined}>
                  {visits[date].map((visit: Visit, index: number) => {
                    return (
                      <VisitListItemContainer
                        key={visit.id}
                        visit={visit}
                        job={job}
                        index={index}
                        onClick={e => this.onClick(visit)}
                      />
                    );
                  })}
                </List>
              </Box>
            );
          })}
        </List>
        <ListPlaceholder
          filteredTotal={isFetching ? null : Object.entries(visits).length}
          unfilteredTotal={isFetching ? null : Object.entries(visits).length}
          emptyMessage={intlEmpytMessage}
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
