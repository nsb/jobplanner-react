import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import Select from 'grommet/components/Select'
import FormField from 'grommet/components/FormField'
import LayerForm from 'grommet-templates/components/LayerForm'
import RRule from 'rrule'

const normalizeSelect = (value) => {
  return value.option
}

const renderSelect = ({ input, label, options, onSearch, meta: { touched, error, warning } }) => {
  return (
    <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
      <Select {...input} options={options} onSearch={onSearch} />
    </FormField>
  )
}

const rruleFrequency = [
  { label: "Yearly", value: RRule.YEARLY },
  { label: "Monthly", value: RRule.MONTHLY },
  { label: "Weekly", value: RRule.WEEKLY },
  { label: "Daily", value: RRule.DAILY },
]

class JobScheduleEdit extends Component {
  static propTypes = {
    rrule: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
  }

  constructor (props) {
    super()
    this.state = {
      freq: RRule.WEEKLY,
      interval: 1,
      byweekday: [RRule.MO],
      dtstart: new Date(),
      until: null
    }
  }

  render () {
    const { rrule, heading, onClose, onSubmit } = this.props
    const freqOption = rruleFrequency.find((freq) => {
      return freq.value === this.state.freq
    })

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
          {rrule.toText()}
        </fieldset>
      </LayerForm>
    )
  }

  onFreqChange = (e) => {
    this.setState({ freq: e.option.value })
  }
}

export default reduxForm({
  form: 'JobScheduleEdit',  // a unique identifier for this form
})(JobScheduleEdit)
