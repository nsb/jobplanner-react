// @flow

import React from "react";
import ListItem from "grommet/components/ListItem";
import type { Business } from "../actions/businesses";

type Props = {
  business: Business,
  index: number,
  onClick: Function
};

export default ({ business, index, onClick }: Props) =>
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
