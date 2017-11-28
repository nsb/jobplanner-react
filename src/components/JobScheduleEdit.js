// @flow

import React, { Component } from "react";
import Select from "grommet/components/Select";
import FormField from "grommet/components/FormField";
import NumberInput from "grommet/components/NumberInput";
import LayerForm from "grommet-templates/components/LayerForm";
import { RRule } from "rrule";
import { xor } from "lodash";

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

type Props = {
  onClose: Function,
  onSubmit: Function,
  schedule: Object
};

type State = {
  schedule: Object
};

class JobScheduleEdit extends Component<Props, State> {
  state = {
    schedule: Object.assign({}, this.props.schedule)
  };

  render() {
    const { onClose } = this.props;

    const freqOption = rruleFrequency.find(freq => {
      return freq.value === this.state.schedule.freq;
    });

    const { byweekday } = this.state.schedule;

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
        <FormField label="Weekdays" htmlFor="freq">
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
        </FormField>
      );
    }

    if (schedule.freq === RRule.MONTHLY) {
      scheduleComponent = <div>monthly</div>;
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
