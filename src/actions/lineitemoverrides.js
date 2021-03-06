// @flow

export type LineItemOverride = {
  line_item: number,
  visit?: number,
  name: string,
  description: string,
  unit_cost: number,
  quantity: number
};

export type LineItemOverridesMap = { [id: number]: LineItemOverride };