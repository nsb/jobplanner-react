// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Field, formValueSelector, reduxForm } from "redux-form";
import Button from "grommet/components/Button";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import CheckBox from "grommet/components/CheckBox";
import DateTime from "grommet/components/DateTime";
import type { Client } from "../actions/clients";
import type { Element } from "react";

const validate = (values: Client) => {
  const errors = {};
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

const renderCheckBox = ({
  input,
  label,
  meta: { touched, error, warning }
}): Element<*> =>
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <CheckBox {...input} checked={!!input.value} />
  </FormField>;

const renderDateTime = ({
  input,
  label,
  dateFormat,
  meta: { touched, error, warning }
}): Element<*> => {
  return (
    <FormField
      label={label}
      htmlFor={input.name}
      error={touched ? error : null}
    >
      <DateTime {...input} format={dateFormat} />
    </FormField>
  );
};

type Props = {
  handleSubmit: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean,
  initialValues: Object,
  anytime: boolean
};

class VisitForm extends Component<Props> {
  render() {
    const {
      handleSubmit,
      valid,
      dirty,
      submitting,
      initialValues,
      anytime
    } = this.props;

    const dateFormat = anytime ? "M/D/YYYY" : "M/D/YYYY h:mm a";

    return (
      <Form onSubmit={handleSubmit}>

        <Header size="large" justify="between" pad="none">
          <Heading tag="h2" margin="none" strong={true}>
            {initialValues ? "Edit visit" : "Add visit"}
          </Heading>
        </Header>

        <FormFields>

          <fieldset>

            <Field
              name="description"
              label="Description"
              component={renderField}
              type="text"
            />

          </fieldset>

          <fieldset>
            <Heading tag="h3">Schedule</Heading>
            <Field
              name="begins"
              label="Begins"
              component={renderDateTime}
              dateFormat={dateFormat}
              format={(value, name) => moment(value).toDate()}
              normalize={(value: string) => moment(value, dateFormat).toDate()}
            />
            <Field
              name="ends"
              label="Ends"
              component={renderDateTime}
              dateFormat={dateFormat}
              format={(value, name) => moment(value).toDate()}
              normalize={(value: string) => moment(value, dateFormat).toDate()}
            />
            <Field
              name="anytime"
              label="Anytime"
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
            label={initialValues ? "Save" : "Add"}
            onClick={valid && dirty && !submitting ? () => true : undefined}
          />
        </Footer>
      </Form>
    );
  }
}

let SelectingFormValuesVisitForm = reduxForm({
  form: "visit",
  validate
})(VisitForm);

const selector = formValueSelector("visit");
SelectingFormValuesVisitForm = connect(state => {
  const anytime: boolean = selector(state, "anytime");
  return {
    anytime
  };
})(SelectingFormValuesVisitForm);

export default SelectingFormValuesVisitForm;
