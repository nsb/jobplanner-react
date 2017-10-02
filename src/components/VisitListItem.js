// @flow

import React, { Component } from "react";
import ListItem from "grommet/components/ListItem";
import CheckBox from "grommet/components/CheckBox";
import Timestamp from "grommet/components/Timestamp";
import type { Visit } from "../actions/visits";
import VisitDetailContainer from "./VisitLayerContainer";

type Props = {
  visit: Visit,
  index: number
};

type State = {
  selected?: Visit
};

class VisitListItem extends Component<Props, State> {
  state = {
    selected: undefined
  };

  render() {
    const { visit, index } = this.props;

    let visitLayer;
    if (this.state.selected) {
      visitLayer = (
        <VisitDetailContainer
          visit={this.state.selected}
          onClose={this.onClose}
        />
      );
    }

    return (
      <ListItem
        direction="row"
        align="center"
        justify="between"
        separator={index === 0 ? "horizontal" : "bottom"}
        pad={{ horizontal: "medium", vertical: "small", between: "medium" }}
        responsive={false}
        onClick={this.onClick}
        selected={false}
      >
        <CheckBox label="" />
        <span>
          <Timestamp
            fields={visit.anytime ? "date" : ["date", "time"]}
            value={visit.begins}
          />
        </span>
        {visitLayer}
      </ListItem>
    );
  }

  onClick = () => {
    const { visit } = this.props;
    this.setState({ selected: visit });
  };

  onClose = () => {
    this.setState({ selected: undefined });
  };
}

export default VisitListItem;
