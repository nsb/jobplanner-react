// @flow

import React from "react";
import { Field, reduxForm } from "redux-form";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";
import Button from "grommet/components/Button";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import BusyIcon from 'grommet/components/icons/Spinning';
import { intlFormFieldRequired, intlFormSavingLabel } from "../i18n";
import type { Element } from "react";

const intlUsernameLabel = (
  <FormattedMessage
    id="signup.usernameLabel"
    description="Login form username label"
    defaultMessage="E-mail"
  />
)

const intlPasswordLabel = (
  <FormattedMessage
    id="signup.passwordLabel"
    description="Login form password label"
    defaultMessage="Password"
  />
)

const intlSubmitLabel = (
  <FormattedMessage
    id="signup.submitLabel"
    description="Signup form submit label"
    defaultMessage="Register"
  />
)

const intlHaveAccount = (
  <FormattedMessage
    id="signup.haveAccount"
    description="Signup form have account"
    defaultMessage="Already have an account?"
  />
)

const intlLogin = (
  <FormattedMessage
    id="signup.login"
    description="Login form signup"
    defaultMessage="Login here here"
  />
)

const intlInvalidEmail = (
  <FormattedMessage
    id="signup.invalidEmail"
    description="Signup form invalid email"
    defaultMessage="Invalid"
  />
)

const validate = (values: Object): Object => {
  const errors = {};
  if (!values.username) {
    errors.username = intlFormFieldRequired;
  } else if (!values.username.includes('@')) {
    errors.username = intlInvalidEmail
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
  onClose?: Function,
  isFetching: boolean
};

export const SignupForm = ({
  handleSubmit,
  valid,
  dirty,
  submitting,
  isFetching
}: Props & { intl: intlShape }) => {

  const control = isFetching ? (
    <Box direction="row" align="center"
      pad={{ horizontal: 'medium', between: 'small' }}>
      <BusyIcon /><span className="secondary">{intlFormSavingLabel}</span>
    </Box>
  ) : (
    <Button
      type="submit"
      primary={true}
      label={intlSubmitLabel}
      onClick={valid && dirty && !submitting ? () => true : undefined}
    />
  )

  return (
    <Form onSubmit={handleSubmit} pad="medium">
      <FormFields>
        <fieldset>
          <Field
            name="username"
            label={intlUsernameLabel}
            component={renderField}
            type="email"
          />
          <Field
            name="password"
            label={intlPasswordLabel}
            component={renderField}
            type="password"
          />
        </fieldset>
      </FormFields>

      <Footer size="small" direction="column" align="start"
      pad={{ vertical: 'none', between: 'medium' }}>
        <span />
        {control}
        <div>{intlHaveAccount} <Anchor label={intlLogin} path="/login" /></div>
      </Footer>
    </Form>
  );
};

export default reduxForm({
  form: "signup", // a unique identifier for this form
  validate
})(injectIntl(SignupForm));
