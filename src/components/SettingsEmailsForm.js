// @flow

import React from "react";
import {injectIntl, FormattedMessage} from 'react-intl';
import { Field, reduxForm } from "redux-form";
import Button from "grommet/components/Button";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Form from "grommet/components/Form";
import CheckBox from "grommet/components/CheckBox";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import { intlFormFieldRequired, intlFormSaveLabel } from "../i18n";
import type { Element } from "react";

const intlTitle = (
  <FormattedMessage
    id="settingsEmailForm.title"
    description="Settings email form title"
    defaultMessage="Client emails"
  />
)

const intlReminderLegend = (
  <FormattedMessage
    id="settingsEmailForm.reminderEmailLegend"
    description="Settings email form reminder email legend"
    defaultMessage="Reminder email"
  />
)

const intlReminderSubject = (
  <FormattedMessage
    id="settingsEmailForm.reminderEmailSubjectLabel"
    description="Settings email form reminder email subject label"
    defaultMessage="Reminder subject"
  />
)

const intlReminderMessage = (
  <FormattedMessage
    id="settingsEmailForm.reminderEmailMessageLabel"
    description="Settings email form reminder email message label"
    defaultMessage="Reminder message"
  />
)

const intlReminderEnabled = (
  <FormattedMessage
    id="settingsEmailForm.reminderEmailEnabledLabel"
    description="Settings email form reminder email enabled label"
    defaultMessage="Enabled"
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

const renderCheckBox = ({
  input,
  label,
  meta: { touched, error, warning }
}): Element<*> => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <CheckBox {...input} checked={!!input.value} />
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
      <Header>
        <Heading tag="h3"strong={true}>
          {intlTitle}
        </Heading>
      </Header>

      <FormFields>
        <fieldset>
          <legend>{intlReminderLegend}</legend>
          <Field
            name="upcoming_visit_reminder_email_subject"
            label={intlReminderSubject}
            component={renderField}
            type="text"
          />
          <Field
            name="upcoming_visit_reminder_email_body"
            label={intlReminderMessage}
            component={renderTextArea}
            type="text"
            rows="5"
          />
          <Field
            name="visit_reminders_enabled"
            label={intlReminderEnabled}
            component={renderCheckBox}
            parse={(value: boolean | string) => !!value}
          />
        </fieldset>
      </FormFields>

      <Footer pad={{ vertical: "medium" }}>
        <span />
        <Button
          type="submit"
          primary={true}
          label={intlFormSaveLabel}
          onClick={valid && dirty && !submitting ? () => true : undefined}
        />
      </Footer>
    </Form>
  );
};

export default reduxForm({
  form: "emailsedit",
  validate
})(injectIntl(EmailsForm));
