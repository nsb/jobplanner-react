// @flow

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import InvoiceList from "../components/InvoiceListContainer";
import InvoiceDetail from "../components/InvoiceDetail";

class Invoices extends Component<*> {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/:businessId/invoices/:invoiceId"
          component={InvoiceDetail}
        />
        <Route component={InvoiceList} />
      </Switch>
    );
  }
}

export default Invoices;
