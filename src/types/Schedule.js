// flow

export type Schedule = {
  freq: number,
  interval: number,
  byweekday?: Array<number>,
  bymonthday?: Array<number>
};
