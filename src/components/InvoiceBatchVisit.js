// @flow

import React, { Component } from 'react';
import Box from "grommet/components/Box";
import ListItem from "grommet/components/ListItem";
import CheckBox from 'grommet/components/CheckBox';
import Timestamp from "grommet/components/Timestamp";
import Value from 'grommet/components/Value';
import type { Visit } from "../actions/visits";

export type VisitSelection = Map<number, boolean>;

export type Props = {
  visit: Visit,
  selected: VisitSelection,
  onChange: (VisitSelection) => void
};

class InvoiceBatchVisit extends Component<Props> {

  render() {
    const { visit, selected } = this.props;

    return (
      <ListItem
        separator="none"
      >
        <Box full="horizontal" direction="row">
          <Box direction="row" flex="grow">
            <CheckBox
              checked={selected.get(visit.id)}
              onChange={this.onChanged} />
            <Timestamp fields={["date", "year"]} value={visit.begins} />
          </Box>
          <Box
            direction="row"
            // pad="medium"
            // justify="end"
            // align="end"
            // alignSelf="end"
            text-align="right"
          >
            <Value value={visit.total_cost} size="small" />
          </Box>
        </Box>
      </ListItem>
    )
  }

  onChanged = () => {
    const { onChange, visit, selected } = this.props;
    onChange(new Map([[visit.id, !selected.get(visit.id)]]));
  }
};

export default InvoiceBatchVisit;