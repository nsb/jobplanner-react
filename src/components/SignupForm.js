// @flow

import React from "react";
import { Field, reduxForm } from "redux-form";
import Anchor from "grommet/components/Anchor";
import Button from "grommet/components/Button";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import type { Element } from "react";

const validate = (values: Object): Object => {
  const errors = {};
  if (!values.username) {
    errors.username = "Required";
  }
  return errors;
};

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}): Element<*> => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>
);

type Props = {
  handleSubmit?: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean,
  onClose?: Function
};

export const SignupForm = ({
  handleSubmit,
  valid,
  dirty,
  submitting
}: Props) => {
  return (
    <Form onSubmit={handleSubmit} pad="medium">
      <FormFields>
        <fieldset>
          <Field
            name="username"
            label="E-mail"
            component={renderField}
            type="email"
          />
        </fieldset>
      </FormFields>

      <Footer size="small" direction="column" align="start"
      pad={{ vertical: 'none', between: 'medium' }}>
        <span />
        <Button
          type="submit"
          primary={true}
          label="Register"
          onClick={valid && dirty && !submitting ? () => true : undefined}
        />
        <div>Already have an account? <Anchor label="Log in here" path="/login" /></div>
      </Footer>
    </Form>
  );
};

export default reduxForm({
  form: "signup", // a unique identifier for this form
  validate
})(SignupForm);
