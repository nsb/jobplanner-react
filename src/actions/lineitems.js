// @flow
import type { LineItemOverride } from "./lineitemoverrides";

export type LineItem = {
  id: number,
  name: string,
  description: string,
  unit_cost: number,
  quantity: number,
  overrides: Array<LineItemOverride>
};

export type LineItemsMap = { [id: number]: LineItem };
