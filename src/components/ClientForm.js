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

const ClientForm = (props) => {
  const { handleSubmit, pristine, reset, submitting, onClose } = props
  return (
    <form onSubmit={handleSubmit}>

      <Header size="large" justify="between" pad="none">
        <Heading tag="h2" margin="none" strong={true}>
          Add Client
        </Heading>
        <Anchor icon={<CloseIcon />} onClick={onClose}
          a11yTitle='Close Add Client Form' />
      </Header>

      <FormFields>

        <fieldset>

          <FormField label="First Name" htmlFor="first_name" error={null}>
            <Field name="first_name" component="input" type="text" />
          </FormField>
          <FormField label="Last Name" htmlFor="last_name" error={null}>
            <Field name="last_name" component="input" type="text" />
          </FormField>

        </fieldset>

      </FormFields>

      <Footer pad={{vertical: 'medium'}}>
        <span />
        <Button type="submit" primary={true} label="Add"
             onClick={() => true} />
      </Footer>
    </form>


  )
}

export default reduxForm({
  form: 'client'  // a unique identifier for this form
})(ClientForm)
