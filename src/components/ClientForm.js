import React from 'react'
import { Field, reduxForm } from 'redux-form'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import Form from 'grommet/components/Form'
import Footer from 'grommet/components/Footer'
import FormFields from 'grommet/components/FormFields'
import FormField from 'grommet/components/FormField'
import CloseIcon from 'grommet/components/icons/base/Close'

const validate = values => {
  const errors = {}
  if (!values.first_name) {
    errors.first_name = 'Required'
  }
  if (!values.last_name) {
    errors.last_name = 'Required'
  }
  return errors
}

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>
)

const ClientForm = (props) => {
  const { handleSubmit, valid, dirty, submitting, onClose, initialValues } = props
  return (
    <Form onSubmit={handleSubmit}>

      <Header size="large" justify="between" pad="none">
        <Heading tag="h2" margin="none" strong={true}>
          { initialValues ? 'Edit client' : 'Add Client' }
        </Heading>
        <Anchor icon={<CloseIcon />} onClick={onClose}
          a11yTitle='Close' />
      </Header>

      <FormFields>

        <fieldset>

          <Heading tag="h3">Client details</Heading>
          <Field name="first_name" label="First name" component={renderField} type="text" />
          <Field name="last_name" label="Last Name" component={renderField} type="text" />

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

export default reduxForm({
  form: 'client',  // a unique identifier for this form
  validate
})(ClientForm)
