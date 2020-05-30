// @flow

import React, { Component } from "react";
import { injectIntl, FormattedMessage, intlShape } from "react-intl";
import Box from "grommet/components/Box";
import ListItem from "grommet/components/ListItem";
import CheckBox from "grommet/components/CheckBox";
import Timestamp from "grommet/components/Timestamp";
import Value from "grommet/components/Value";
import VisitStatusTag from "./VisitStatusTag";
import type { Visit } from "../actions/visits";
import type { VisitSelection } from "../utils/invoices";

const intlSelectedMessage = (
  <FormattedMessage
    id="invoiceBatchVisit.markedCompleted"
    description="Selecting a non completed visit, will change it to completed"
    defaultMessage="Will be marked completed."
  />
);

export type Props = {
  visit: Visit,
  selected: VisitSelection,
  onChange: (VisitSelection) => void,
};

class InvoiceBatchVisit extends Component<Props & { intl: intlShape }> {
  render() {
    const { visit, selected } = this.props;

    let willBeMarkedComplete;
    if (selected.get(visit.id) && !visit.completed) {
      willBeMarkedComplete = <Box>{intlSelectedMessage}</Box>;
    }

    return (
      <ListItem separator="none">
        <Box full="horizontal" direction="row">
          <Box direction="row" flex="grow">
            <Box direction="row" margin={{ right: "small" }}>
              <CheckBox
                checked={selected.get(visit.id)}
                onChange={this.onChanged}
              />
              <Timestamp fields={["date", "year"]} value={visit.begins} />
            </Box>
            <Box margin={{ right: "small" }}>
              <VisitStatusTag status={visit.status} />
            </Box>
            {willBeMarkedComplete}
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
    );
  }

  onChanged = () => {
    const { onChange, visit, selected } = this.props;
    onChange(new Map([[visit.id, !selected.get(visit.id)]]));
  };
}

export default injectIntl(InvoiceBatchVisit);
