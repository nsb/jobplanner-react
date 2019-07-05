// @flow
import React from "react";
import { Field, reduxForm } from "redux-form";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Form from "grommet/components/Form";
import FormField from "grommet/components/FormField";
import Footer from "grommet/components/Footer";
import Button from "grommet/components/Button";
import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import type { Credentials } from "../actions/auth";
import type { Element } from "react";
import { intlFormFieldRequired } from "../i18n";

const intlUsernameLabel = (
  <FormattedMessage
    id="loginForm.usernameLabel"
    description="Login form username label"
    defaultMessage="Username"
  />
)

const intlPasswordLabel = (
  <FormattedMessage
    id="loginForm.passwordLabel"
    description="Login form password label"
    defaultMessage="Password"
  />
)

const intlForgotPassword = (
  <FormattedMessage
    id="loginForm.forgotPassword"
    description="Login form forgot password"
    defaultMessage="Forgot password?"
  />
)

const intlSubmitLabel = (
  <FormattedMessage
    id="loginForm.submitLabel"
    description="Login form submit label"
    defaultMessage="Login"
  />
)

const intlNoAccount = (
  <FormattedMessage
    id="loginForm.noAccount"
    description="Login form no account"
    defaultMessage="Don't have an account?"
  />
)

const intlSignup = (
  <FormattedMessage
    id="loginForm.signup"
    description="Login form signup"
    defaultMessage="Signup here"
  />
)

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const validate = (values: Credentials): Object => {
  const errors = {};
  if (!values.username) {
    errors.username = intlFormFieldRequired;
  }
  if (!values.password) {
    errors.password = intlFormFieldRequired;
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

let LoginForm = ({ handleSubmit, valid, dirty, submitting, errors, intl }: Props & { intl: intlShape }) => {

  const errorsNode = errors.map((error, index) => {
    if (error) {
      let errorMessage;
      if (React.isValidElement(error)) {
        errorMessage = error;
      } else {
        errorMessage = intl.formatMessage({id: error});
      }
      return (
        <div key={index} className='error'>
          {errorMessage}
        </div>
      );
    }
    return undefined;
  });

  return (
    <Form onSubmit={handleSubmit} pad="medium">
      <fieldset>
        <Field
          name="username"
          label={intlUsernameLabel}
          component={renderField}
          type="text"
        />
        <Field
          name="password"
          label={intlPasswordLabel}
          component={renderField}
          type="password"
        />
         {errorsNode}
        <Box pad="none">
          <Anchor label={intlForgotPassword} href={`${API_ENDPOINT}/password_reset/`} />
        </Box>
      </fieldset>
      <Footer size="small" direction="column"
        align="start"
        pad={{ vertical: 'none', between: 'medium' }}>
        <Button
          primary={true}
          type="submit"
          label={intlSubmitLabel}
          onClick={valid && dirty && !submitting ? () => true : undefined} />
        <div>{intlNoAccount} <Anchor label={intlSignup} path="/signup" /></div>
      </Footer>
    </Form>
  )
};

export default reduxForm({
  form: "mylogin", // a unique identifier for this form
  validate
})(injectIntl(LoginForm));