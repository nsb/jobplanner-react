import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import Form from 'grommet/components/Form'
import Footer from 'grommet/components/Footer'
import FormFields from 'grommet/components/FormFields'
import FormField from 'grommet/components/FormField'
import Select from 'grommet/components/Select'
import CloseIcon from 'grommet/components/icons/base/Close'
import AddIcon from 'grommet/components/icons/base/Add'
import List from 'grommet/components/List'
import JobScheduleItem from './JobScheduleItem'

const validate = values => {
  const errors = {}
  return errors
}

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>
)

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

class JobForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired,
    clients : PropTypes.array.isRequired
  }

  constructor (props) {
    super()
    this.state = {
      clientsSearchText: '',
      scheduleLayer: false
    }
  }

  render () {
    const { clients, handleSubmit, valid, dirty, submitting, onClose, initialValues } = this.props

    const filteredClients = clients.filter((client) => {
      const searchText = this.state.clientsSearchText.toLowerCase()
      if (searchText) {
        return `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchText)
      } else {
        return true
      }
    })

    const mappedClients = filteredClients.map((client) => {
      return {
        value: client.id,
        label: `${client.first_name} ${client.last_name}`
      }
    })

    let layer = this.renderLayer()

    return (
      <div>
        <Form onSubmit={handleSubmit}>

          <Header size="large" justify="between" pad="none">
            <Heading tag="h2" margin="none" strong={true}>
              { initialValues ? 'Edit job' : 'Add Job' }
            </Heading>
            <Anchor icon={<CloseIcon />} onClick={onClose}
              a11yTitle='Close' />
          </Header>

          <FormFields>

            <fieldset>

              <Heading tag="h3">Job details</Heading>
              <Field name="client" label="Client" component={renderSelect}
                options={mappedClients} onSearch={this.onSearch}
                onChange={this.onChange}
                normalize={normalizeSelect} />
              <Field name="description" label="Description" component={renderField} type="text" />

            </fieldset>

            {this.renderSchedules()}

          </FormFields>

          <Footer pad={{vertical: 'medium'}}>
            <span />
            <Button type="submit" primary={true} label={ initialValues ? 'Save' : 'Add' }
                 onClick={valid && dirty && !submitting ? () => true : null} />
          </Footer>
        </Form>
        {layer}
      </div>
    )
  }

  renderSchedules = () => {
    return (
      <fieldset>
        <Header size="small" justify="between">
          <Heading tag="h3">Schedule</Heading>
          <Button icon={<AddIcon />} onClick={this.onScheduleAdd}
          a11yTitle='Add Network' />
        </Header>
        <List>
          {[]}
        </List>
      </fieldset>
    )
  }

  renderLayer = () => {
      const { scheduleLayer } = this.state
      console.log('scheduleLayer', scheduleLayer)
      let result;
      if (scheduleLayer) {
        result = (
          <JobScheduleItem />
        )
      }
      return result
    }

  onScheduleAdd = (e) => {
    console.log("scheduleLayer")
    this.setState({ scheduleLayer: true })
  }

  onSearch = (e) => {
    const clientsSearchText = e.target.value
    this.setState({ clientsSearchText })
  }
}

export default reduxForm({
  form: 'job',  // a unique identifier for this form
  validate
})(JobForm)
