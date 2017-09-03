// @flow

import React, { Component } from "react";
import ListItem from "grommet/components/ListItem";
import type { Business } from "../actions/businesses";

type Props = {
  business: Business,
  index: number,
  onClick: Function
};

class BusinessListItem extends Component<Props> {

  render() {
    const { business, index, onClick } = this.props;
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
        <span>{business.name}</span>
      </ListItem>
    );
  }
}

export default BusinessListItem;
