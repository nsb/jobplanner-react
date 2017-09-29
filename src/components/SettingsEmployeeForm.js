// @flow

import React from "react";
import { Field, reduxForm } from "redux-form";
import Button from "grommet/components/Button";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import NumberInput from "grommet/components/NumberInput";
import type { Element } from "react";
import type { Employee } from "../actions/employees";

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
  initialValues?: Employee
};

export const EmployeeForm = ({
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
          <Field
            name="username"
            label="Username"
            component={renderField}
            type="text"
          />
          <Field
            name="first_name"
            label="First name"
            component={renderField}
            type="text"
          />
          <Field
            name="last_name"
            label="Last name"
            component={renderField}
            type="text"
          />
          <Field
            name="email"
            label="Email"
            component={renderField}
            type="text"
          />
        </fieldset>
      </FormFields>

      <Footer pad={{ vertical: "medium" }}>
        <span />
        <Button
          type="submit"
          primary={true}
          label={
            initialValues && initialValues.id ? "Update employee" : "Add employee"
          }
          onClick={valid && dirty && !submitting ? () => true : undefined}
        />
      </Footer>
    </Form>
  );
};

export default reduxForm({
  validate
})(EmployeeForm);
