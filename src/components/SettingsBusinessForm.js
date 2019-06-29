// @flow

import React from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import { Field, reduxForm } from "redux-form";
import Button from "grommet/components/Button";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import { intlFormFieldRequired } from "../i18n";
import type { Element } from "react";

const intlTitle = (
  <FormattedMessage
    id="settingsBusinessForm.title"
    description="Settings business form title"
    defaultMessage="Company settings"
  />
)

const intlName = (
  <FormattedMessage
    id="settingsBusinessForm.nameLabel"
    description="Settings business form name label"
    defaultMessage="Name"
  />
)

const intlSubmitLabel = (
  <FormattedMessage
    id="settingsBusinessForm.submitLabel"
    description="Settings business form submit label"
    defaultMessage="Update settings"
  />
)

const validate = (values: Object): Object => {
  const errors = {};
  if (!values.name) {
    errors.name = intlFormFieldRequired;
  }
  return errors;
};

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}): Element<*> =>
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>;

type Props = {
  handleSubmit: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean,
  onClose: Function
};

export const BusinessForm = ({
  handleSubmit,
  valid,
  dirty,
  submitting,
  onClose
}: Props & { intl: intlShape }) => {
  return (
    <Form onSubmit={handleSubmit}>

      <Header size="large" justify="between" pad="none">
        <Heading tag="h2" margin="none" strong={true}>
          {intlTitle}
        </Heading>
      </Header>

      <FormFields>

        <fieldset>

          <Field name="name" label={intlName} component={renderField} type="text" />

        </fieldset>

      </FormFields>

      <Footer pad={{ vertical: "medium" }}>
        <span />
        <Button
          type="submit"
          primary={true}
          label={intlSubmitLabel}
          onClick={valid && dirty && !submitting ? () => true : undefined}
        />
      </Footer>
    </Form>
  );
};

export default reduxForm({
  form: "businessedit",
  validate
})(injectIntl(BusinessForm));
