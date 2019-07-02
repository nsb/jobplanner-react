// @flow

import React from "react";
import {injectIntl, FormattedMessage} from 'react-intl';
import { Field, reduxForm } from "redux-form";
import Button from "grommet/components/Button";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import NumberInput from "grommet/components/NumberInput";
import { intlFormFieldRequired } from "../i18n";
import type { Element } from "react";
import type { Service } from "../actions/services";

const intlName = (
  <FormattedMessage
    id="settingsServiceForm.nameLabel"
    description="Settings service form name label"
    defaultMessage="Name"
  />
)

const intlDescription = (
  <FormattedMessage
    id="settingsServiceForm.descriptionLabel"
    description="Settings service form description label"
    defaultMessage="Description"
  />
)

const intlUnitCost = (
  <FormattedMessage
    id="settingsServiceForm.unitCostLabel"
    description="Settings service form unit cost label"
    defaultMessage="Unit cost"
  />
)

const intlUpdate = (
  <FormattedMessage
    id="settingsServiceForm.updateLabel"
    description="Settings service form update label"
    defaultMessage="Update service"
  />
)

const intlAdd = (
  <FormattedMessage
    id="settingsServiceForm.addLabel"
    description="Settings service form add label"
    defaultMessage="Add service"
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

const renderNumberField = ({
  input,
  label,
  meta: { touched, error, warning }
}): Element<*> =>
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <NumberInput {...input} />
  </FormField>;

type Props = {
  handleSubmit: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean,
  onClose: Function,
  initialValues?: Service
};

export const ServiceForm = ({
  handleSubmit,
  valid,
  dirty,
  submitting,
  onClose,
  initialValues
}: Props) => {
  return (
    <Form onSubmit={handleSubmit}>

      <FormFields>

        <fieldset>

          <Field name="name" label={intlName} component={renderField} type="text" />
          <Field
            name="description"
            label={intlDescription}
            component={renderField}
            type="text"
          />
          <Field
            name="unit_cost"
            label={intlUnitCost}
            component={renderNumberField}
          />

        </fieldset>

      </FormFields>

      <Footer pad={{ vertical: "medium" }}>
        <span />
        <Button
          type="submit"
          primary={true}
          label={
            initialValues && initialValues.id ? intlUpdate : intlAdd
          }
          onClick={valid && dirty && !submitting ? () => true : undefined}
        />
      </Footer>
    </Form>
  );
};

export default reduxForm({
  validate
})(injectIntl(ServiceForm));
