import React from "react";
import type { Client } from "../actions/clients";

export type Props = {
  client: Client
};


const InvoiceListItemClient = ({
  client
}: Props): Element<*> => (
    <div>{client.is_business ? client.business_name : `${client.first_name} ${client.last_name}`}</div>
  );

export default InvoiceListItemClient;
