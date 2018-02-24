// flow

export type Schedule = {
  freq: number,
  interval: number,
  byweekday?: { weekday: number },
  bymonthday?: Array<number>
};
