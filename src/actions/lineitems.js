// @flow

export type LineItem = {
  id: number,
  name: string,
  description: string,
  unit_cost: number,
  quantity: number
};

export type LineItemsMap = { [id: number]: LineItem };
