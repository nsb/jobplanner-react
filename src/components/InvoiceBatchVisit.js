// @flow

import React, { Component } from 'react';
import ListItem from "grommet/components/ListItem";
import Box from 'grommet/components/Box';
import CheckBox from 'grommet/components/CheckBox';
import Timestamp from "grommet/components/Timestamp";
import type { Visit } from "../actions/visits";

export type VisitSelection = { [key: string]: boolean }

export type Props = {
  visit: Visit,
  lineItems: Array<Visit>,
  selected: VisitSelection,
  onChange: ({ [key: string]: boolean }) => void
};

class InvoiceBatchVisit extends Component<Props> {

  render() {
    const { visit, selected } = this.props;

    return (
      <ListItem
        direction="column"
        separator="none"
      >
        <Box>
          <span>
            <CheckBox
              checked={selected[visit.id.toString()]}
              onChange={(e) => false} />
            <Timestamp fields={["date", "year"]} value={visit.begins} />
          </span>
        </Box>
      </ListItem>
    )
  }
};

export default InvoiceBatchVisit;