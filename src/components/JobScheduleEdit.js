// @flow

import React, { Component } from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Box from "grommet/components/Box";
import Select from "grommet/components/Select";
import FormField from "grommet/components/FormField";
import NumberInput from "grommet/components/NumberInput";
import LayerForm from "grommet-templates/components/LayerForm";
import { RRule } from "rrule";
import { xor } from "lodash";
import type { Schedule } from "../types/Schedule";

const intlTitle = (
  <FormattedMessage
    id="jobScheduleEdit.title"
    description="Job schedule edit title"
    defaultMessage="Repeat"
  />
)

const intlSubmitLabel = (
  <FormattedMessage
    id="jobScheduleEdit.submitLabel"
    description="Job schedule submit label"
    defaultMessage="OK"
  />
)

const intlFrequencyLabel = (
  <FormattedMessage
    id="jobScheduleEdit.frequencyLabel"
    description="Job schedule frequency label"
    defaultMessage="Frequency"
  />
)

const intlFrequencyDaily = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.frequencyDaily"
    description="Job schedule frequency daily"
    defaultMessage="Daily"
  />
)

const intlFrequencyWeekly = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.frequencyWeekly"
    description="Job schedule frequency weekly"
    defaultMessage="Weekly"
  />
)

const intlFrequencyMonthly = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.frequencyMonthly"
    description="Job schedule frequency monthly"
    defaultMessage="Monthly"
  />
)

const intlFrequencyYearly = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.frequencyYearly"
    description="Job schedule frequency yearly"
    defaultMessage="Yearly"
  />
)

const intlIntervalLabel = (
  <FormattedMessage
    id="jobScheduleEdit.intervalLabel"
    description="Job schedule interval label"
    defaultMessage="Interval"
  />
)

const intlWeekdaysLabel = (
  <FormattedMessage
    id="jobScheduleEdit.weekdaysLabel"
    description="Job schedule weekdays label"
    defaultMessage="Weekdays"
  />
)

const intlWeekLabel = (
  <FormattedMessage
    id="jobScheduleEdit.weekLabel"
    description="Job schedule week label"
    defaultMessage="Week"
  />
)

const intlWeekDayLabel = (
  <FormattedMessage
    id="jobScheduleEdit.weekDayLabel"
    description="Job schedule week day label"
    defaultMessage="On day"
  />
)

const intlWeekdayMonday = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.byWeekdayMonday"
    description="Job schedule by weekday Monday"
    defaultMessage="Monday"
  />
)

const intlWeekdayTuesday = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.byWeekdayTuesday"
    description="Job schedule by weekday Tuesday"
    defaultMessage="Tuesday"
  />
)

const intlWeekdayWednesday = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.byWeekdayWednesday"
    description="Job schedule by weekday Wednesday"
    defaultMessage="Wednesday"
  />
)

const intlWeekdayThursday = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.byWeekdayThursday"
    description="Job schedule by weekday Thursday"
    defaultMessage="Thursday"
  />
)

const intlWeekdayFriday = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.byWeekdayFriday"
    description="Job schedule by weekday Friday"
    defaultMessage="Friday"
  />
)

const intlWeekdaySaturday = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.byWeekdaySaturday"
    description="Job schedule by weekday Saturday"
    defaultMessage="Saturday"
  />
)

const intlWeekdaySunday = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.byWeekdaySunday"
    description="Job schedule by weekday Sunday"
    defaultMessage="Sunday"
  />
)

const intlWeekFirst = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.weekFirst"
    description="Job schedule week first"
    defaultMessage="First"
  />
)

const intlWeekSecond = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.weekSecond"
    description="Job schedule week second"
    defaultMessage="Second"
  />
)

const intlWeekThird = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.weekThird"
    description="Job schedule week third"
    defaultMessage="Third"
  />
)

const intlWeekFourth = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.weekFourth"
    description="Job schedule week fourth"
    defaultMessage="Fourth"
  />
)

const intlWeekLast = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobScheduleEdit.weekLast"
    description="Job schedule week last"
    defaultMessage="Last"
  />
)

const byMonthWeekDays = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, -1]
];

const rruleFrequency: Array<{label: string, value: number }> = [
  { label: "jobScheduleEdit.frequencyDaily", value: RRule.DAILY },
  { label: "jobScheduleEdit.frequencyWeekly", value: RRule.WEEKLY },
  { label: "jobScheduleEdit.frequencyMonthly", value: RRule.MONTHLY },
  { label: "jobScheduleEdit.frequencyYearly", value: RRule.YEARLY }
];

const rruleByWeekDay = [
  { label: "jobScheduleEdit.byWeekdayMonday", value: RRule.MO.weekday },
  { label: "jobScheduleEdit.byWeekdayTuesday", value: RRule.TU.weekday },
  { label: "jobScheduleEdit.byWeekdayWednesday", value: RRule.WE.weekday },
  { label: "jobScheduleEdit.byWeekdayThursday", value: RRule.TH.weekday },
  { label: "jobScheduleEdit.byWeekdayFriday", value: RRule.FR.weekday },
  { label: "jobScheduleEdit.byWeekdaySaturday", value: RRule.SA.weekday },
  { label: "jobScheduleEdit.byWeekdaySunday", value: RRule.SU.weekday }
];

const rruleByMonthDay = [
  { label: "jobScheduleEdit.weekFirst", value: 1 },
  { label: "jobScheduleEdit.weekSecond", value: 2 },
  { label: "jobScheduleEdit.weekThird", value: 3 },
  { label: "jobScheduleEdit.weekFourth", value: 4 },
  { label: "jobScheduleEdit.weekLast", value: 5 }
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

class JobScheduleEdit extends Component<Props & { intl: intlShape }, State> {
  state = {
    schedule: Object.assign({}, this.props.schedule),
    byMonthDaySplashed: []
  };

  constructor(props: Props & { intl: intlShape }) {
    super(props);

    byMonthWeekDays.forEach((days, index) => {
      const { schedule } = this.props;
      if (days.every(val => schedule.bymonthday && schedule.bymonthday.includes(val))) {
        this.state.byMonthDaySplashed.push(index + 1);
      }
    });
  }

  render() {
    const { onClose, intl } = this.props;

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
        <FormField label={intlIntervalLabel} htmlFor="interval">
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
      const weekdayOptions: Array<{ label: String, value: string }> = 
        rruleByWeekDay.map((option) => {
        return { label: intl.formatMessage({id: option.label}), value: option.value };
      });

      scheduleByWeekday = (
        <FormField label={intlWeekdaysLabel} htmlFor="byweekday">
          <Box margin={{ vertical: "none", horizontal: "medium" }}>
            <Select
              id="byweekday"
              name="byweekday"
              inline={true}
              multiple={true}
              value={byweekday}
              options={weekdayOptions}
              onChange={this.onByWeekDayChange}
              onSearch={undefined}
            />
          </Box>
        </FormField>
      );
    }

    if (schedule.freq === RRule.MONTHLY) {
      const monthDayOptions: Array<{ label: String, value: number }> = 
        rruleByMonthDay.map((option) => {
        return { label: intl.formatMessage({id: option.label}), value: option.value };
      });

      const weekdayOptions: Array<{ label: String, value: string }> = 
        rruleByWeekDay.map((option) => {
        return { label: intl.formatMessage({id: option.label}), value: option.value };
      });

      let scheduleByMonthDay = (
        <FormField label={intlWeekLabel} htmlFor="bymonthday">
          <Box margin={{ vertical: "none", horizontal: "medium" }}>
            <Select
              id="bymonthday"
              name="bymonthday"
              inline={true}
              multiple={true}
              value={byMonthDaySplashed}
              options={monthDayOptions}
              onChange={this.onByMonthDayChange}
              onSearch={undefined}
            />
          </Box>
        </FormField>
      );

      let scheduleByWeekDay = (
        <FormField label={intlWeekDayLabel} htmlFor="byweekday">
          <Box margin={{ vertical: "none", horizontal: "medium" }}>
            <Select
              id="byweekday"
              name="byweekday"
              inline={true}
              multiple={true}
              value={byweekday}
              options={weekdayOptions}
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

    let selectedFreqOption = rruleFrequency.find(freq => {
      return freq.value === this.state.schedule.freq;
    });
    const freqOption = selectedFreqOption ? { ...selectedFreqOption, label: intl.formatMessage({ id: selectedFreqOption.label }) } : "";

    const frequencyOptions: Array<{ label: String, value: number }> = 
      rruleFrequency.map((option) => {
        return { label: intl.formatMessage({id: option.label}), value: option.value };
      });

    return (
      <LayerForm
        title={intlTitle}
        submitLabel={intlSubmitLabel}
        onClose={onClose}
        onSubmit={this.onSubmit}
        secondaryControl={null}
      >
        <fieldset>
          <FormField label={intlFrequencyLabel} htmlFor="freq">
            <Select
              id="freq"
              name="freq"
              value={freqOption}
              options={frequencyOptions}
              onChange={this.onFreqChange}
              onSearch={undefined}
              inline={true}
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

  onFreqChange = (event: { option: { value: number }, target: { value: number }}) => {
    var schedule = { ...this.state.schedule };
    const value = event.option ? event.option.value : event.target.value;
    schedule.freq = value;
    this.setState({ schedule });
  };

  onByWeekDayChange = (event: { option: { value: string } }) => {
    const schedule = Object.assign(this.state.schedule, {
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

export default injectIntl(JobScheduleEdit);
