import React from "react";
import type { Client } from "../actions/clients";

export type Props = {
  client: Client
};


const InvoiceListItemClient = ({
  client
}: Props): Element<*> => (
  <div>{client.first_name} {client.last_name}</div>
);

export default InvoiceListItemClient;
