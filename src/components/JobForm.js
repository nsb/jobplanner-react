import React, { PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import Form from 'grommet/components/Form'
import Footer from 'grommet/components/Footer'
import FormFields from 'grommet/components/FormFields'
import FormField from 'grommet/components/FormField'
import TextInput from 'grommet/components/TextInput'
import Select from 'grommet/components/Select'
import CloseIcon from 'grommet/components/icons/base/Close'

const validate = values => {
  const errors = {}
  return errors
}

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <TextInput {...input} type={type} />
  </FormField>
)

const renderSelect = ({ input, label, options, onSearch, meta: { touched, error, warning } }) => {
  console.log(input,options)
  return (
    <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
      <Select {...input} options={options} />
    </FormField>
  )
}

const JobForm = (props) => {
  const { clients, handleSubmit, valid, dirty, submitting, onClose, initialValues } = props
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
            options={clients} onSearch={(s) => {console.log(s)}} />
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

JobForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  clients : PropTypes.array.isRequired
}

export default reduxForm({
  form: 'job',  // a unique identifier for this form
  validate
})(JobForm)
