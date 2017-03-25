import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import Select from 'grommet/components/Select'
import FormField from 'grommet/components/FormField'
import NumberInput from 'grommet/components/NumberInput'
import LayerForm from 'grommet-templates/components/LayerForm'
import RRule from 'rrule'

const rruleFrequency = [
  { label: "Daily", value: RRule.DAILY },
  { label: "Weekly", value: RRule.WEEKLY },
  { label: "Monthly", value: RRule.MONTHLY },
  { label: "Yearly", value: RRule.YEARLY }
]

const rruleByWeekDay = [
  { label: "Monday", value: RRule.MO },
  { label: "Tuesday", value: RRule.TU },
  { label: "Wednesday", value: RRule.WE },
  { label: "Thursday", value: RRule.TH },
  { label: "Friday", value: RRule.FR },
  { label: "Saturday", value: RRule.SA },
  { label: "Sunday", value: RRule.SU }
]

class JobScheduleEdit extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      freq: RRule.WEEKLY,
      interval: 1,
      wkst: RRule.MO,
      count: null,
      until: null,
      bysetpos: null,
      bymonth: null,
      byweekday: [RRule.MO],
      dtstart: new Date(),
    }
  }

  render () {
    const { onClose, onSubmit } = this.props

    const freqOption = rruleFrequency.find((freq) => {
      return freq.value === this.props.freq
    })

    const byweekdayOption = rruleByWeekDay.find((byweekday) => {
      return byweekday.value = this.state.byweekday
    })

    let schedule = null
    if (this.props.freq === RRule.DAILY) {
      schedule = <FormField label="Interval" htmlFor="interval">
        <NumberInput id="interval" name="interval" min={1}
          value={this.state.interval}
          onChange={this.onIntervalChange}></NumberInput>
      </FormField>
    } else if (this.props.freq === RRule.WEEKLY) {
      schedule = <FormField label="Weekdays" htmlFor="freq" >
          <Select id="byweekday" name="byweekday"
            inline={true} multiple={true}
            value={byweekdayOption} options={rruleByWeekDay}
            onChange={this.onByWeekDayChange}
            onSearch={null} />
        </FormField>
    } else if (this.props.freq === RRule.MONTHLY) {
      schedule = <div>monthly</div>
    }

    return (
      <LayerForm title="Add schedule" submitLabel="OK"
        onClose={onClose} onSubmit={onSubmit}
        secondaryControl={null}>
        <fieldset>
          <FormField label="Frequency" htmlFor="freq" >
            <Select id="freq" name="freq"
              value={freqOption} options={rruleFrequency}
              onChange={this.onFreqChange}
              onSearch={null} />
          </FormField>
          {schedule}
        </fieldset>
      </LayerForm>
    )
  }

  onFreqChange = (e) => {
    this.props.onChange(e)
  }

  onByWeekDayChange = (e) => {
    console.log(e.option.value.weekday)
  }

  onIntervalChange = (e) => {
    this.setState({ interval: e.target.value })
  }
}

export default reduxForm({
  form: 'JobScheduleEdit',  // a unique identifier for this form
})(JobScheduleEdit)
