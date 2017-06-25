// @flow

import React from 'react';
import {Field, FieldArray, reduxForm} from 'redux-form';
import Section from 'grommet/components/Section';
import Anchor from 'grommet/components/Anchor';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Form from 'grommet/components/Form';
import Footer from 'grommet/components/Footer';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import CloseIcon from 'grommet/components/icons/base/Close';
import type {Client} from '../actions/clients';

const validate = (values: Client) => {
  const errors = {};
  if (!values.first_name) {
    errors.first_name = 'Required';
  }
  if (!values.last_name) {
    errors.last_name = 'Required';
  }
  return errors;
};

const renderField = ({input, label, type, meta: {touched, error, warning}}) => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>
);

const renderProperties = ({ fields, meta: { error, submitFailed } }) => (
  <Section>
    <div>
      <button type="button" onClick={() => fields.push({})}>Add Property</button>
      {submitFailed && error && <span>{error}</span>}
    </div>
    {fields.map((property, index) => (
      <div key={index}>
        <button
          type="button"
          title="Remove Property"
          onClick={() => fields.remove(index)}
        />
        <h4>Propterty #{index + 1}</h4>
        <Field
          name={`${property}.id`}
          type="hidden"
          component={renderField}
        />
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
      </div>
    ))}
  </Section>
)

type Props = {
  handleSubmit: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean,
  onClose: Function,
  initialValues: Object
}

const ClientForm = (props: Props) => {
  const {
    handleSubmit,
    valid,
    dirty,
    submitting,
    onClose,
    initialValues,
  } = props;
  return (
    <Form onSubmit={handleSubmit}>

      <Header size="large" justify="between" pad="none">
        <Heading tag="h2" margin="none" strong={true}>
          {initialValues ? 'Edit client' : 'Add Client'}
        </Heading>
        <Anchor icon={<CloseIcon />} onClick={onClose} a11yTitle="Close" />
      </Header>

      <FormFields>

        <fieldset>

          <Heading tag="h3">Client details</Heading>
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
          <FieldArray
            name="properties"
            label="Properties"
            component={renderProperties}
          />

        </fieldset>

      </FormFields>

      <Footer pad={{vertical: 'medium'}}>
        <span />
        <Button
          type="submit"
          primary={true}
          label={initialValues ? 'Save' : 'Add'}
          onClick={valid && dirty && !submitting ? () => true : undefined}
        />
      </Footer>
    </Form>
  );
};

export default reduxForm({
  form: 'client', // a unique identifier for this form
  validate,
})(ClientForm);
