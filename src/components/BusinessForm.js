import React from 'react'
import { Field, reduxForm } from 'redux-form'
import Button from 'grommet/components/Button'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import Form from 'grommet/components/Form'
import Footer from 'grommet/components/Footer'
import FormFields from 'grommet/components/FormFields'
import FormField from 'grommet/components/FormField'

const validate = values => {
  const errors = {}
  if (!values.name) {
    errors.name = 'Required'
  }
  return errors
}

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>
)

const BusinessForm = (props) => {
  const { handleSubmit, valid, dirty, submitting } = props
  return (
    <Form onSubmit={handleSubmit}>

      <Header size="large" justify="between" pad="none">
        <Heading tag="h2" margin="none" strong={true}>
          Add Business
        </Heading>
      </Header>

      <FormFields>

        <fieldset>

          <Field name="name" label="Name" component={renderField} type="text" />

        </fieldset>

      </FormFields>

      <Footer pad={{vertical: 'medium'}}>
        <span />
        <Button type="submit" primary={true} label="Save"
             onClick={valid && dirty && !submitting ? () => true : null} />
      </Footer>
    </Form>


  )
}

export default reduxForm({
  form: 'business',  // a unique identifier for this form
  validate
})(BusinessForm)
