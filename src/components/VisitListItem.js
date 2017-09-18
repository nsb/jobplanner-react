// @flow

import React, { Component } from "react";
import ListItem from "grommet/components/ListItem";
import CheckBox from "grommet/components/CheckBox";
import Timestamp from "grommet/components/Timestamp";
import type { Visit } from "../actions/visits";

type Props = {
  visit: Visit,
  index: number,
  onClick: (SyntheticEvent<>) => void
};

class VisitListItem extends Component<Props> {
  render() {
    const { visit, index, onClick } = this.props;
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
        <CheckBox label="" />
        <span>
          <Timestamp
            fields={visit.anytime ? "date" : ["date", "time"]}
            value={visit.begins}
          />
        </span>
      </ListItem>
    );
  }
}

export default VisitListItem;
