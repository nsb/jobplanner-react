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

const validate = values => {
  const errors = {}
  return errors
}

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>
)

const renderSelect = ({ input, label, options, onSearch, meta: { touched, error, warning } }) => {

  // We need to destructure value because we get an object from redux-form
  if (input.value) {
    const { value : { option : { value : myVal }}} = input
    input.value = myVal
  }

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
      client: null
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
        client: client,
        value: client.first_name,
        label: client.first_name
      }
    })

    return (
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
              onChange={this.onChange} />
            <Field name="description" label="Description" component={renderField} type="text" />

          </fieldset>

        </FormFields>

        <Footer pad={{vertical: 'medium'}}>
          <span />
          <Button type="submit" primary={true} label={ initialValues ? 'Save' : 'Add' }
               onClick={valid && dirty && !submitting ? () => true : null} />
        </Footer>
      </Form>
    )
  }

  onChange = (e) => {
    this.setState({client: e.option.client})
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
