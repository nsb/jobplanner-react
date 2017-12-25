// @flow
import { normalize } from "normalizr";
import { addSuccess, addError } from "redux-flash-messages";
import { reminderScheduleSchema, reminderScheduleListSchema } from "../schemas";
import type { Dispatch, ThunkAction } from "../types/Store";
import servicesApi from "../api";
import history from "../history";

export type ReminderSchedule = {
  id: number,
  business: number,
  unit: number,
  value: number,
  enabled: boolean
};

export type ReminderScheduleMap = { [id: number]: ReminderSchedule };
