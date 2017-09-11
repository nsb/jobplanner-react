// @flow

import React from "react";
import { Field, reduxForm } from "redux-form";
import Anchor from "grommet/components/Anchor";
import Button from "grommet/components/Button";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import CloseIcon from "grommet/components/icons/base/Close";
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
}): Element<*> =>
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>;

type Props = {
  handleSubmit?: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean,
  onClose?: Function
};

const BusinessForm = ({
  handleSubmit,
  valid,
  dirty,
  submitting,
  onClose
}: Props) => {
  return (
    <Form onSubmit={handleSubmit}>

      <Header size="large" justify="between" pad="none">
        <Heading tag="h2" margin="none" strong={true}>
          Add Business
        </Heading>
        <Anchor
          icon={<CloseIcon />}
          onClick={onClose}
          a11yTitle="Close Add Client Form"
        />
      </Header>

      <FormFields>

        <fieldset>

          <Field name="name" label="Name" component={renderField} type="text" />

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
  form: "business", // a unique identifier for this form
  validate
})(BusinessForm);
