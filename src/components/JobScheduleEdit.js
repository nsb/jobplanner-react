// @flow

import React, { Component } from "react";
import Box from "grommet/components/Box";
import Select from "grommet/components/Select";
import FormField from "grommet/components/FormField";
import NumberInput from "grommet/components/NumberInput";
import LayerForm from "grommet-templates/components/LayerForm";
import { RRule } from "rrule";
import { xor } from "lodash";
import type { Schedule } from "../types/Schedule";

const byMonthWeekDays = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, -1]
];

const rruleFrequency = [
  { label: "Daily", value: RRule.DAILY },
  { label: "Weekly", value: RRule.WEEKLY },
  { label: "Monthly", value: RRule.MONTHLY },
  { label: "Yearly", value: RRule.YEARLY }
];

const rruleByWeekDay = [
  { label: "Monday", value: RRule.MO.weekday },
  { label: "Tuesday", value: RRule.TU.weekday },
  { label: "Wednesday", value: RRule.WE.weekday },
  { label: "Thursday", value: RRule.TH.weekday },
  { label: "Friday", value: RRule.FR.weekday },
  { label: "Saturday", value: RRule.SA.weekday },
  { label: "Sunday", value: RRule.SU.weekday }
];

const rruleByMonthDay = [
  { label: "First", value: 1 },
  { label: "Second", value: 2 },
  { label: "Third", value: 3 },
  { label: "Fourth", value: 4 },
  { label: "Last", value: 5 }
];

type Props = {
  onClose: Function,
  onSubmit: Function,
  schedule: Schedule
};

type State = {
  schedule: Schedule,
  byMonthDaySplashed: Array<number>
};

class JobScheduleEdit extends Component<Props, State> {
  state = {
    schedule: Object.assign({}, this.props.schedule),
    byMonthDaySplashed: []
  };

  constructor(props: Props) {
    super(props);

    byMonthWeekDays.forEach((days, index) => {
      if (days.every(val => props.schedule.bymonthday.includes(val))) {
        this.state.byMonthDaySplashed.push(index + 1);
      }
    });
  }

  render() {
    const { onClose } = this.props;

    const freqOption = rruleFrequency.find(freq => {
      return freq.value === this.state.schedule.freq;
    });

    const {
      schedule: { byweekday },
      byMonthDaySplashed
    } = this.state;

    let schedule = this.state.schedule;
    let scheduleInterval;
    let scheduleByWeekday;
    let scheduleComponent;
    if (
      schedule.freq === RRule.DAILY ||
      schedule.freq === RRule.WEEKLY ||
      schedule.freq === RRule.MONTHLY ||
      schedule.freq === RRule.YEARLY
    ) {
      scheduleInterval = (
        <FormField label="Interval" htmlFor="interval">
          <NumberInput
            id="interval"
            name="interval"
            min={1}
            value={schedule.interval}
            onChange={this.onIntervalChange}
          />
        </FormField>
      );
    }

    if (schedule.freq === RRule.WEEKLY) {
      scheduleByWeekday = (
        <FormField label="Weekdays" htmlFor="byweekday">
          <Box margin={{ vertical: "none", horizontal: "medium" }}>
            <Select
              id="byweekday"
              name="byweekday"
              inline={true}
              multiple={true}
              value={byweekday}
              options={rruleByWeekDay}
              onChange={this.onByWeekDayChange}
              onSearch={undefined}
            />
          </Box>
        </FormField>
      );
    }

    if (schedule.freq === RRule.MONTHLY) {
      let scheduleByMonthDay = (
        <FormField label="Week" htmlFor="bymonthday">
          <Box margin={{ vertical: "none", horizontal: "medium" }}>
            <Select
              id="bymonthday"
              name="bymonthday"
              inline={true}
              multiple={true}
              value={byMonthDaySplashed}
              options={rruleByMonthDay}
              onChange={this.onByMonthDayChange}
              onSearch={undefined}
            />
          </Box>
        </FormField>
      );

      let scheduleByWeekDay = (
        <FormField label="on day" htmlFor="byweekday">
          <Box margin={{ vertical: "none", horizontal: "medium" }}>
            <Select
              id="byweekday"
              name="byweekday"
              inline={true}
              multiple={true}
              value={byweekday}
              options={rruleByWeekDay}
              onChange={this.onByWeekDayChange}
              onSearch={undefined}
            />
          </Box>
        </FormField>
      );

      scheduleComponent = (
        <div>
          {scheduleByMonthDay}
          {scheduleByWeekDay}
        </div>
      );
    }

    return (
      <LayerForm
        title="Repeat"
        submitLabel="OK"
        onClose={onClose}
        onSubmit={this.onSubmit}
        secondaryControl={null}
      >
        <fieldset>
          <FormField label="Frequency" htmlFor="freq">
            <Select
              id="freq"
              name="freq"
              value={freqOption}
              options={rruleFrequency}
              onChange={this.onFreqChange}
              onSearch={undefined}
            />
          </FormField>
          {scheduleInterval}
          {scheduleByWeekday}
          {scheduleComponent}
        </fieldset>
      </LayerForm>
    );
  }

  onSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { schedule } = this.state;
    this.props.onSubmit(schedule);
  };

  onFreqChange = (e: SyntheticEvent<>) => {
    this._onChange(e);
  };

  onByWeekDayChange = (event: Object) => {
    let schedule = Object.assign(this.state.schedule, {
      byweekday: xor(this.state.schedule.byweekday, [event.option.value])
    });
    this.setState(schedule);
  };

  onByMonthDayChange = (event: Object) => {
    let byMonthDaySplashed = xor(this.state.byMonthDaySplashed, [
      event.option.value
    ]);
    let bymonthday = [].concat(
      ...byMonthWeekDays.filter((val, index) => {
        return byMonthDaySplashed.includes(index + 1);
      })
    );
    let schedule = Object.assign(this.state.schedule, { bymonthday });
    this.setState({ byMonthDaySplashed, schedule });
  };

  onIntervalChange = (e: SyntheticEvent<>) => {
    this._onChange(e);
  };

  _onChange = (event: Object) => {
    var schedule = { ...this.state.schedule };
    const attribute = event.target.getAttribute("name");
    const value = event.option ? event.option.value : event.target.value;
    schedule[attribute] = value;
    this.setState({ schedule });
  };
}

export default JobScheduleEdit;
