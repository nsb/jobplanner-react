// @flow

import React from "react";
import { Field, reduxForm } from "redux-form";
import Button from "grommet/components/Button";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import type { Element } from "react";

const validate = (values: Object): Object => {
  const errors = {};
  if (!values.name) {
    errors.name = "Required";
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

const renderTextArea = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}): Element<*> => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <textarea rows="5" {...input} type={type} />
  </FormField>
);

type Props = {
  handleSubmit: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean
};

export const EmailsForm = ({
  handleSubmit,
  valid,
  dirty,
  submitting
}: Props) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Header size="large" justify="between" pad="none">
        <Heading tag="h2" margin="none" strong={true}>
          Client emails
        </Heading>
      </Header>

      <FormFields>
        <fieldset>
          <legend>Reminder e-mail</legend>
          <Field
            name="upcoming_visit_reminder_email_subject"
            label="Reminder subject"
            component={renderField}
            type="text"
          />
          <Field
            name="upcoming_visit_reminder_email_body"
            label="Reminder message"
            component={renderTextArea}
            type="text"
            rows="5"
          />
        </fieldset>
      </FormFields>

      <Footer pad={{ vertical: "medium" }}>
        <span />
        <Button
          type="submit"
          primary={true}
          label="Save"
          onClick={valid && dirty && !submitting ? () => true : undefined}
        />
      </Footer>
    </Form>
  );
};

export default reduxForm({
  form: "emailsedit",
  validate
})(EmailsForm);
