// @flow

import React, { Component } from "react";
import { Field } from "redux-form";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Section from "grommet/components/Section";
import Box from "grommet/components/Box";
import FormField from "grommet/components/FormField";
import NumberInput from "grommet/components/NumberInput";
import Button from "grommet/components/Button";
import CloseIcon from "grommet/components/icons/base/Close";
import RenderTextField from "./LineItemTextInput";
import type { Service } from "../actions/services";

const intlAddButton = (
  <FormattedMessage
    id="lineItemsForm.addButton"
    description="Line items add button"
    defaultMessage="Add Line item"
  />
)

const intlLineItem = (index: number) => (
  <FormattedMessage
    id="lineItemsForm.lineItemIndex"
    description="Line items index"
    defaultMessage="Line item #{index}"
    values={{index}}
  />
)

const intlName = (
  <FormattedMessage
    id="lineItemsForm.nameLabel"
    description="Line items name label"
    defaultMessage="Name"
  />
)

const intlDescription = (
  <FormattedMessage
    id="lineItemsForm.descriptionLabel"
    description="Line items description label"
    defaultMessage="Description"
  />
)

const intlQuantity = (
  <FormattedMessage
    id="lineItemsForm.quantityLabel"
    description="Line items quantity label"
    defaultMessage="Quantity"
  />
)

const intlUnitCost = (
  <FormattedMessage
    id="lineItemsForm.unitCostLabel"
    description="Line items unit cost label"
    defaultMessage="Unit cost"
  />
)

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

const renderNumberField = ({
  input,
  label,
  meta: { touched, error, warning }
}): Element<*> => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <NumberInput {...input} />
  </FormField>
);

export type LineItemProps = {
  formName: string,
  suggestions: Array<{ label: string, value: Service }>,
  fields: Object,
  meta: { error: boolean, submitFailed: boolean },
  change: Function
};

type Suggestion = { label: string, value: Service };

type LineItemState = {
  value: string,
  suggestions: Array<Suggestion>
};

class LineItemsForm extends Component<LineItemProps & { intl: intlShape }, LineItemState> {
  constructor(props: LineItemProps) {
    super();
    this.state = { value: "", suggestions: props.suggestions };
  }

  onNameChange = (event, index) => {
    const { formName, change } = this.props;
    const regexp = new RegExp("^" + event.target.value.toLowerCase());
    const suggestions = this.props.suggestions.filter(suggestion => {
      return regexp.test(suggestion.label.toLowerCase());
    });
    this.setState({ suggestions: suggestions });
    change(formName, `line_items[${index}].name`, event.target.value);
  };

  onNameSelect = ({ target, suggestion }, index) => {
    const { formName, change } = this.props;
    const { value } = suggestion;
    change(formName, `line_items[${index}].name`, value.name);
    change(formName, `line_items[${index}].description`, value.description);
    change(formName, `line_items[${index}].quantity`, value.quantity || 1);
    change(formName, `line_items[${index}].unit_cost`, value.unit_cost);
  };

  render() {
    const { fields, meta: { error, submitFailed } } = this.props;

    return (
      <Section>
          {fields.map((lineItem, index) => (
            <Box margin={{bottom: "medium"}}>
              <div key={index}>
                {intlLineItem(index + 1)}
                <Button icon={<CloseIcon />}
                  onClick={() => fields.remove(index)}
                  href='#'
                  primary={false}
                  accent={false}
                  plain={true} />
                <Field
                  name={`${lineItem}.id`}
                  type="hidden"
                  component={renderField}
                />
                <Field
                  name={`${lineItem}.name`}
                  component={RenderTextField}
                  label={intlName}
                  onDomChange={e => this.onNameChange(e, index)}
                  onSelect={e => this.onNameSelect(e, index)}
                  suggestions={this.state.suggestions}
                />
                <Field
                  name={`${lineItem}.description`}
                  type="text"
                  component={renderField}
                  label={intlDescription}
                />
                <Field
                  name={`${lineItem}.quantity`}
                  component={renderNumberField}
                  label={intlQuantity}
                />
                <Field
                  name={`${lineItem}.unit_cost`}
                  component={renderNumberField}
                  label={intlUnitCost}
                />
              </div>
            </Box>
          ))}
        <Box>
          <button type="button" onClick={() => fields.push({})}>
            {intlAddButton}
          </button>
          {submitFailed && error && <span>{error}</span>}
        </Box>
      </Section>
    );
  }
}

export default injectIntl(LineItemsForm);
