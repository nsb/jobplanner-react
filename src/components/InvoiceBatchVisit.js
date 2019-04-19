// @flow

import React, { Component } from 'react';
import ListItem from "grommet/components/ListItem";
import Box from 'grommet/components/Box';
import CheckBox from 'grommet/components/CheckBox';
import Timestamp from "grommet/components/Timestamp";
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
        direction="horizontal"
        separator="none"
      >
        <Box>
          <span>
            <CheckBox
              checked={true}
              onChange={(e) => false} />
            <Timestamp fields={["date", "year"]} value={visit.begins} />
          </span>
        </Box>
      </ListItem>
    )
  }
};

export default InvoiceBatchVisit;