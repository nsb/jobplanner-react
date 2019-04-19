// @flow

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import InvoiceBatchLoader from "../components/InvoiceBatchLoader";

class Invoices extends Component<*> {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/:businessId/invoices/:invoiceId"
          component={Component}
        />
        <Route component={InvoiceBatchLoader} />
      </Switch>
    );
  }
}

export default Invoices;
