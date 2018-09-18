// @flow

import React, { Component } from "react";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import type { LineItem } from "../actions/lineitems";

export type Props = {
  lineItems: Array<LineItem>
};

class InvoiceDetailLineItemList extends Component<Props> {
  render() {
    const { lineItems } = this.props;

    return (
      <div>
        <List onMore={undefined}>
          {lineItems.map((lineItem, index) => {
            return (
              <ListItem key={lineItem.id}>
                <span>{lineItem.name}</span>
              </ListItem>
            );
          })}
        </List>
        <ListPlaceholder
          filteredTotal={lineItems.length}
          unfilteredTotal={lineItems.length}
          emptyMessage="No line items."
        />
      </div>
    );
  }
}

export default InvoiceDetailLineItemList;
