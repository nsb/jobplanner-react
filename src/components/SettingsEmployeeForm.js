// @flow

import React from "react";
import { injectIntl, FormattedMessage, intlShape } from "react-intl";
import { Field, reduxForm } from "redux-form";
import Button from "grommet/components/Button";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import CheckBox from "grommet/components/CheckBox";
import Select from "grommet/components/Select";
import { intlFormFieldRequired } from "../i18n";
import type { Element } from "react";
import type { Employee, Role } from "../actions/employees";

const intlFirstName = (
  <FormattedMessage
    id="settingsEmployeeForm.firstNameLabel"
    description="Settings employee form first name label"
    defaultMessage="First name"
  />
);

const intlLastName = (
  <FormattedMessage
    id="settingsEmployeeForm.lastNameLabel"
    description="Settings employee form last name label"
    defaultMessage="Last name"
  />
);

const intlUpdate = (
  <FormattedMessage
    id="settingsEmployeeForm.updateLabel"
    description="Settings employee form update label"
    defaultMessage="Update employee"
  />
);

const intlAdd = (
  <FormattedMessage
    id="settingsEmployeeForm.addLabel"
    description="Settings employee form add label"
    defaultMessage="Add employee"
  />
);

const intlEmail = (
  <FormattedMessage
    id="settingsEmployeeForm.emailLabel"
    description="Settings employee form email label"
    defaultMessage="E-mail"
  />
);

const intlIsActive = (
  <FormattedMessage
    id="settingsEmployeeForm.isActiveLabel"
    description="Settings employee form is active label"
    defaultMessage="Active"
  />
);

const intlRole = (
  <FormattedMessage
    id="settingsEmployeeForm.roleLabel"
    description="Settings employee form role label"
    defaultMessage="Role"
  />
);

const intlRoleAdmin = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="settingsEmployeeForm.roleAdminLabel"
    description="role admin label"
    defaultMessage="Admin"
  />
);

const intlRoleWorker = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="settingsEmployeeForm.roleWorkerLabel"
    description="role worker label"
    defaultMessage="Worker"
  />
);

const validate = (values: Object): Object => {
  const errors = {};
  if (!values.first_name) {
    errors.first_name = intlFormFieldRequired;
  }
  return errors;
};

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
}): Element<*> => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>
);

const renderCheckBox = ({
  input,
  label,
  meta: { touched, error, warning },
}): Element<*> => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <CheckBox {...input} checked={!!input.value} />
  </FormField>
);

const renderSelect = ({
  input,
  label,
  options,
  multiple,
  meta: { touched, error, warning },
}): Element<*> => {
  return (
    <Select
      {...input}
      placeHolder="None"
      inline={false}
      multiple={multiple}
      value={input.value}
      options={options}
      onChange={input.onChange}
    />
  );
};

export const employeeRoleMap: { [key: Role]: string } = {
  admin: "settingsEmployeeForm.roleAdminLabel",
  worker: "settingsEmployeeForm.roleWorkerLabel",
};

type Props = {
  handleSubmit: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean,
  onClose: Function,
  initialValues?: Employee,
};

export const EmployeeForm = ({
  handleSubmit,
  valid,
  dirty,
  submitting,
  onClose,
  initialValues,
  intl,
}: Props & { intl: intlShape }) => {
  const employeeRoleOptions: Array<Object> = Object.entries(
    employeeRoleMap
  ).map(([key, value]) => {
    return { label: intl.formatMessage({ id: value }), value: key };
  });

  return (
    <Form onSubmit={handleSubmit}>
      <FormFields>
        <fieldset>
          <Field
            name="first_name"
            label={intlFirstName}
            component={renderField}
            type="text"
          />
          <Field
            name="last_name"
            label={intlLastName}
            component={renderField}
            type="text"
          />
          <Field
            name="email"
            label={intlEmail}
            component={renderField}
            type="text"
          />
          {initialValues && initialValues.id ? (
            <Field
              name="is_active"
              label={intlIsActive}
              component={renderCheckBox}
              parse={(value: boolean | string) => !!value}
            />
          ) : undefined}
          <Field
            name="role"
            label={intlRole}
            component={renderSelect}
            options={employeeRoleOptions}
            multiple={false}
            normalize={(selected) => selected.value}
          />
        </fieldset>
      </FormFields>

      <Footer pad={{ vertical: "medium" }}>
        <span />
        <Button
          type="submit"
          primary={true}
          label={initialValues && initialValues.id ? intlUpdate : intlAdd}
          onClick={valid && dirty && !submitting ? () => true : undefined}
        />
      </Footer>
    </Form>
  );
};

export default reduxForm({
  validate,
})(injectIntl(EmployeeForm));
