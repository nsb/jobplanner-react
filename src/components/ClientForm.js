// @flow

import React, { Component } from "react";
import { Field, FieldArray, reduxForm } from "redux-form";
import Box from "grommet/components/Box";
import Section from "grommet/components/Section";
import Anchor from "grommet/components/Anchor";
import Button from "grommet/components/Button";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Form from "grommet/components/Form";
import CheckBox from "grommet/components/CheckBox";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import CloseIcon from "grommet/components/icons/base/Close";
import type { Client } from "../actions/clients";
import type { Field as CustomField } from "../actions/fields";
import type { Element } from "react";

const validate = (values: Client) => {
  const errors = {};
  if (!values.is_business && !values.first_name) {
    errors.first_name = "Required";
  }
  if (!values.is_business && !values.last_name) {
    errors.last_name = "Required";
  }
  if (values.is_business && !values.business_name) {
    errors.business_name = "Required"
  }
  if (!values.address_use_property && !values.address1) {
    errors.address1 = "Required"
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

const renderCheckBox = ({
  input,
  label,
  meta: { touched, error, warning }
}): Element<*> => (
    // <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <CheckBox {...input} label={label} checked={!!input.value} />
    // </FormField>
  );

const renderProperties = ({
  fields,
  meta: { error, submitFailed }
}): Element<*> => (
    <Section>
      {fields.map((property, index) => (
        <Box margin={{ bottom: "medium" }}>
          <div key={index}>
            Property #{index + 1}
            <Button icon={<CloseIcon />}
              onClick={() => fields.remove(index)}
              href='#'
              primary={false}
              accent={false}
              plain={true} />
            <Field
              name={`${property}.id`}
              type="hidden"
              component={renderField} />
            <Field
              name={`${property}.address1`}
              type="text"
              component={renderField}
              label="Address 1"
            />
            <Field
              name={`${property}.address2`}
              type="text"
              component={renderField}
              label="Address 2"
            />
            <Field
              name={`${property}.city`}
              type="text"
              component={renderField}
              label="City"
            />
            <Field
              name={`${property}.zip_code`}
              type="text"
              component={renderField}
              label="Zip Code"
            />
          </div>
        </Box>
      ))}
      <Box>
        <button type="button" onClick={() => fields.push({})}>
          Add Property
        </button>
        {submitFailed && error && <span>{error}</span>}
      </Box>
    </Section>
  );

type Props = {
  handleSubmit: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean,
  onClose: Function,
  fields: Array<CustomField>,
  initialValues: Object
};

type State = {
  address_use_property: boolean
}

class ClientForm extends Component<Props, State> {

  constructor({ initialValues }: Props) {
    super();
    this.state = { address_use_property: initialValues.address_use_property };
  }

  render() {
    const {
      handleSubmit,
      valid,
      dirty,
      submitting,
      onClose,
      // fields,
      initialValues
    } = this.props;

    let billingAddress;
    if (!this.state.address_use_property) {
      billingAddress = (
        <fieldset>
          <Heading tag="h3">Billing address</Heading>
          <Field
            name="address1"
            type="text"
            component={renderField}
            label="Address 1"
          />
          <Field
            name="address2"
            type="text"
            component={renderField}
            label="Address 2"
          />
          <Field
            name="city"
            type="text"
            component={renderField}
            label="City"
          />
          <Field
            name="zip_code"
            type="text"
            component={renderField}
            label="Zip Code"
          />
        </fieldset>
      )
    }

    return (
      <Form onSubmit={handleSubmit}>
        <Header size="large" justify="between" pad="none">
          <Heading tag="h2" margin="none" strong={true}>
            {initialValues && initialValues.id ? "Edit client" : "Add Client"}
          </Heading>
          <Anchor icon={<CloseIcon />} onClick={onClose} a11yTitle="Close" />
        </Header>

        <FormFields>
          <fieldset>
            <Heading tag="h3">Client details</Heading>
            <Box direction="row">
              <Field
                name="first_name"
                label="First name"
                component={renderField}
                type="text"
              />
              <Field
                name="last_name"
                label="Last Name"
                component={renderField}
                type="text"
              />
            </Box>
            <Field
              name="business_name"
              label="Company name"
              component={renderField}
              type="text"
            />
            <Field
              name="is_business"
              label="Use company name as the primary name"
              component={renderCheckBox}
              parse={(value: boolean | string) => !!value}
            />
          </fieldset>

          <fieldset>
            <Heading tag="h3">Contact details</Heading>
            <Field
              name="phone"
              label="Phone"
              component={renderField}
              type="text"
            />
            <Field
              name="email"
              label="E-mail"
              component={renderField}
              type="email"
            />
          </fieldset>

          <fieldset>
            <Heading tag="h3">Automated notifications</Heading>
            <Field
              name="upcoming_visit_reminder_email_enabled"
              label="Visit reminders"
              component={renderCheckBox}
              parse={(value: boolean | string) => !!value}
            />
          </fieldset>

          <fieldset>
            <Heading tag="h3">Property details</Heading>
            <FieldArray
              name="properties"
              label="Properties"
              component={renderProperties}
            />
            <Field
              name="address_use_property"
              label="Billing address is the same as property address"
              component={renderCheckBox}
              parse={(value: boolean | string) => !!value}
              onChange={(event, value) => { this.setState({ address_use_property: value }) }}
            />
          </fieldset>

          {billingAddress}

          {/* <fieldset>
            <Heading tag="h3">Additional client details</Heading>
            {fields.map((field, index) => (
              <Field
                name={field.name}
                label={field.label}
                component={renderField}
                type={field.type}
              />
            ))}
          </fieldset> */}
        </FormFields>

        <Footer pad={{ vertical: "medium" }}>
          <span />
          <Button
            type="submit"
            primary={true}
            label={initialValues ? "Save" : "Add"}
            onClick={valid && dirty && !submitting ? () => true : undefined}
          />
        </Footer>
      </Form>
    );
  }
};

export default reduxForm({
  form: "client", // a unique identifier for this form
  validate
})(ClientForm);
