// @flow

import React, { Component } from 'react';
import ListItem from "grommet/components/ListItem";
import Box from 'grommet/components/Box';
import type { Visit } from "../actions/visits";

export type Props = {
  visit: Visit,
  lineItems: Array<Visit>
};

class InvoiceBatchVisit extends Component<Props> {

  render() {
    const { visit } = this.props;

    return (
      <ListItem
        direction="row"
        align="start"
        justify="between"
        // separator={index === 0 ? "horizontal" : "bottom"}
        pad={{ horizontal: "medium", vertical: "small", between: "medium" }}
        responsive={true}
        onClick={undefined}
        selected={false}
      >
        <Box>{visit.id}</Box>
      </ListItem>
    )
  }
};

export default InvoiceBatchVisit;