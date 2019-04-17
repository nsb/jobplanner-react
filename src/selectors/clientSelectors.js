// @flow

import { createSelector } from "reselect";
import type { State as ReduxState } from "../types/State";
import type { Client } from "../actions/clients";
import { ensureState } from "redux-optimistic-ui";

const clientsSelector = (state: ReduxState) => ensureState(state.entities).clients;
const idSelector = (state, props) => props.id;

export const getClientById: (ReduxState, Object) => Client = createSelector(
   clientsSelector,
   idSelector,
   (clients, id) => clients[id]
);