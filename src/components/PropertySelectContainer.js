// @flow

import { connect } from "react-redux";
import PropertySelect from "./PropertySelect";
import type { State as ReduxState } from "../types/State";
import { ensureState } from "redux-optimistic-ui";
import type { Client } from "../actions/clients";
import type { Property } from "../actions/properties";
import type { Props } from "./PropertySelect";

const mapStateToProps = (
  { entities }: ReduxState,
  {
    client,
    onSelect
  }: {
    client: ?Client,
    onSelect: (selection: { value: Property, label: string } | null) => void
  }
): Props => ({
  properties: client
    ? client.properties.map(
        property => ensureState(entities).properties[property.id || property]
      )
    : [],
  onSelect: onSelect
});

export default connect(mapStateToProps)(PropertySelect);
