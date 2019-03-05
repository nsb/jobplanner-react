// @flow
import React from "react";
import { Field, reduxForm } from "redux-form";
import Form from "grommet/components/Form";
import FormField from "grommet/components/FormField";
import Footer from "grommet/components/Footer";
import Button from "grommet/components/Button";
import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import type { Credentials } from "../actions/auth";
import type { Element } from "react";

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const validate = (values: Credentials): Object => {
  const errors = {};
  if (!values.username) {
    errors.username = "Required";
  }
  if (!values.password) {
    errors.password = "Required";
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
  handleSubmit: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean
};

let LoginForm = ({ handleSubmit, valid, dirty, submitting }: Props) => (
  <Form onSubmit={handleSubmit} pad="medium">
    <fieldset>
      <Field
        name="username"
        label="Username"
        component={renderField}
        type="text"
      />
      <Field
        name="password"
        label="Password"
        component={renderField}
        type="password"
      />
      <Box pad="none">
        <Anchor label='Forgot password?' href={`${API_ENDPOINT}/password_reset/`} />
      </Box>
    </fieldset>
    <Footer size="small" direction="column"
      align="start"
      pad={{ vertical: 'none', between: 'medium' }}>
      <Button
        primary={true}
        type="submit"
        label="Login"
        onClick={valid && dirty && !submitting ? () => true : undefined} />
      <div>Don't have an account? <Anchor label='Sign up here' path="/signup" /></div>
    </Footer>
  </Form>
);

export default reduxForm({
  form: "mylogin", // a unique identifier for this form
  validate
})(LoginForm);