// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Field, FieldArray, formValueSelector, reduxForm } from "redux-form";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import CheckBox from "grommet/components/CheckBox";
import Select from "grommet/components/Select";
import DateTime from "grommet/components/DateTime";
import BusyIcon from 'grommet/components/icons/Spinning';
import LineItemsFormContainer from "./VisitLineItemsFormContainer";
import { intlFormSaveLabel, intlFormSavingLabel, intlFormFieldRequired } from "../i18n";
import type { Visit } from "../actions/visits";
import type { Employee } from "../actions/employees";
import type { Element } from "react";
import type { Dispatch } from "../types/Store";

const intlTitleEdit = (
  <FormattedMessage
    id="visitForm.titleEdit"
    description="Visit form title edit"
    defaultMessage="Edit visit"
  />
)

const intlTitleAdd = (
  <FormattedMessage
    id="visitForm.titleAdd"
    description="Visit form title add"
    defaultMessage="Add visit"
  />
)

const intlDetails = (
  <FormattedMessage
    id="visitForm.detailsLabel"
    description="Visit form details laben"
    defaultMessage="Details"
  />
)

const intlSchedule = (
  <FormattedMessage
    id="visitForm.scheduleHeading"
    description="Visit form schedule heading"
    defaultMessage="Schedule"
  />
)

const intlBegins = (
  <FormattedMessage
    id="visitForm.beginsLabel"
    description="Visit form begins label"
    defaultMessage="Begins"
  />
)

const intlEnds = (
  <FormattedMessage
    id="visitForm.endsLabel"
    description="Visit form ends label"
    defaultMessage="Ends"
  />
)

const intlAnytime = (
  <FormattedMessage
    id="visitForm.anytimeLabel"
    description="Visit form anytime label"
    defaultMessage="Anytime"
  />
)

const intlAssigned = (
  <FormattedMessage
    id="visitForm.assignedLabel"
    description="Visit form assigned label"
    defaultMessage="Assigned to"
  />
)

const intlCompleted = (
  <FormattedMessage
    id="visitForm.completedLabel"
    description="Visit form completed label"
    defaultMessage="Completed"
  />
)

const intlLineItems = (
  <FormattedMessage
    id="visitForm.lineitemsHeading"
    description="Visit form line items heading"
    defaultMessage="Line Items"
  />
)

const validate = (values: Visit) => {
  const errors = {};
  const lineItemArrayErrors = [];
  values.line_items &&
    values.line_items.forEach((lineItem, lineItemIndex) => {
      const lineItemErrors = {};
      if (!lineItem.line_item) {
        if (!lineItem.name) {
          lineItemErrors.name = intlFormFieldRequired;
          lineItemArrayErrors[lineItemIndex] = lineItemErrors;
        }
        if (!lineItem.quantity) {
          lineItemErrors.quantity = intlFormFieldRequired;
          lineItemArrayErrors[lineItemIndex] = lineItemErrors;
        }
        if (!lineItem.unit_cost) {
          lineItemErrors.unit_cost = intlFormFieldRequired;
          lineItemArrayErrors[lineItemIndex] = lineItemErrors;
        }
      }
    });
  errors.line_items = lineItemArrayErrors;
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
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <CheckBox {...input} checked={!!input.value} />
  </FormField>
);

const renderSelect = ({
  input,
  label,
  options,
  meta: { touched, error, warning }
}): Element<*> => {
  return (
    <FormField
      label={label}
      htmlFor={input.name}
      error={touched ? error : null}
    >
      <Box margin={{ vertical: "none", horizontal: "medium" }}>
        <Select
          {...input}
          placeHolder="None"
          inline={options.length > 20 ? false : true}
          multiple={true}
          value={input.value}
          options={options}
          onChange={input.onChange}
        />
      </Box>
    </FormField>
  );
};

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
  initialValues: Visit & { assigned: Array<{ value: number, label: string }>},
  begins: Date,
  ends: Date,
  anytime: boolean,
  employees: Array<Employee>,
  change: Function,
  dispatch: Dispatch,
  isFetching: boolean
};

class VisitForm extends Component<Props & { intl: intlShape }> {
  dateFormat: string;
  static defaultProps = {
    employees: []
  };

  render() {
    const {
      handleSubmit,
      valid,
      dirty,
      submitting,
      initialValues,
      anytime,
      employees,
      isFetching
    } = this.props;

    const dateFormat = moment()
      .creationData()
      .locale.longDateFormat(anytime ? "L" : "LLL");

      const control = isFetching ? (
        <Box direction="row" align="center"
          pad={{ horizontal: 'medium', between: 'small' }}>
          <BusyIcon /><span className="secondary">{intlFormSavingLabel}</span>
        </Box>
      ) : (
          <Button
            type="submit"
            primary={true}
            label={intlFormSaveLabel}
            onClick={valid && dirty && !submitting ? () => true : undefined}
          />
        )
  
    return (
      <Form onSubmit={handleSubmit}>

        <Header justify="between" pad="none">
          <Heading tag="h4" margin="none" strong={true}>
            {initialValues && initialValues.id ? intlTitleEdit : intlTitleAdd}
          </Heading>
        </Header>

        <Box pad={{ horizontal: "none", vertical: "none" }}>
          <Heading tag="h2" strong={true}>
            {initialValues && initialValues.client_name}
          </Heading>
        </Box>

        <FormFields>
          <fieldset>
            <Field
              name="details"
              label={intlDetails}
              component={renderField}
              type="text"
            />
          </fieldset>

          <fieldset>
            <Heading tag="h3">{intlSchedule}</Heading>
            <Field
              name="begins"
              label={intlBegins}
              component={renderDateTime}
              dateFormat={dateFormat}
              format={(value, name) => moment(value).toDate()}
              normalize={(value: string) => moment(value, dateFormat).toDate()}
              onChange={this.onBeginsChanged}
            />
            <Field
              name="ends"
              label={intlEnds}
              component={renderDateTime}
              dateFormat={dateFormat}
              format={(value, name) => moment(value).toDate()}
              normalize={(value: string) => moment(value, dateFormat).toDate()}
            />
            <Field
              name="anytime"
              label={intlAnytime}
              component={renderCheckBox}
              parse={(value: boolean | string) => !!value}
            />
          </fieldset>

          <fieldset>
            <Field
              name="assigned"
              label={intlAssigned}
              component={renderSelect}
              options={employees.filter((employee) => employee.is_active).map(employee => {
                return { value: employee.id, label: [employee.first_name, employee.last_name].join(' ') };
              })}
              normalize={selected => selected.value}
            />
            <Field
              name="completed"
              label={intlCompleted}
              component={renderCheckBox}
              parse={(value: boolean | string) => !!value}
            />
          </fieldset>

          <fieldset>
            <FieldArray
              name="line_items"
              label={intlLineItems}
              component={LineItemsFormContainer}
            />
          </fieldset>
        </FormFields>

        <Footer pad={{ vertical: "medium" }}>
          <span />
          {control}
        </Footer>
      </Form>
    );
  }

  onBeginsChanged = (e, newValue, prevValue) => {
    const { ends, change, dispatch } = this.props;
    if (newValue > prevValue) {
      const difference = ends - prevValue;
      dispatch(change("ends", newValue.getTime() + difference));
    }
  };
}

let SelectingFormValuesVisitForm = reduxForm({
  form: "visit",
  validate
})(VisitForm);

const selector = formValueSelector("visit");
SelectingFormValuesVisitForm = connect(
  (state): * => {
    const begins: Date = selector(state, "begins");
    const ends: Date = selector(state, "ends");
    const anytime: boolean = selector(state, "anytime");
    return {
      begins,
      ends,
      anytime
    };
  }
)(SelectingFormValuesVisitForm);

export default injectIntl(SelectingFormValuesVisitForm);
