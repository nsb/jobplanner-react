// @flow

import React from "react";
import { Field, reduxForm } from "redux-form";
import Button from "grommet/components/Button";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import type { Element } from "react";
import type { Field as CustomField } from "../actions/fields";

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
}): Element<*> =>
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>;

type Props = {
  handleSubmit: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean,
  onClose: Function,
  initialValues?: CustomField
};

export const FieldForm = ({
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
          <Field name="name" label="Label" component={renderField} type="text" />
        </fieldset>

      </FormFields>

      <Footer pad={{ vertical: "medium" }}>
        <span />
        <Button
          type="submit"
          primary={true}
          label={
            initialValues && initialValues.id ? "Update field" : "Add field"
          }
          onClick={valid && dirty && !submitting ? () => true : undefined}
        />
      </Footer>
    </Form>
  );
};

export default reduxForm({
  validate
})(FieldForm);
