import React, { Component } from "react";
import { Field } from "redux-form";
import Section from "grommet/components/Section";
import FormField from "grommet/components/FormField";
import NumberInput from "grommet/components/NumberInput";
import RenderTextField from "./LineItemTextInput";
import type { Service } from "../actions/services";

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
  meta: { error: boolean, submitFailed: boolean }
};

type Suggestion = { label: string, value: Service };

type LineItemState = {
  value: string,
  suggestions: Array<Suggestion>,
  change: Function
};

class LineItemsForm extends Component<LineItemProps, LineItemState> {
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
        <div>
          <button type="button" onClick={() => fields.push({})}>
            Add Line item
          </button>
          {submitFailed && error && <span>{error}</span>}
        </div>
        {fields.map((lineItem, index) => (
          <div key={index}>
            <button
              type="button"
              title="Remove line item"
              onClick={() => fields.remove(index)}
            />
            <h4>Line item #{index + 1}</h4>
            <Field
              name={`${lineItem}.id`}
              type="hidden"
              component={renderField}
            />
            <Field
              name={`${lineItem}.name`}
              component={RenderTextField}
              label="Name"
              onDomChange={e => this.onNameChange(e, index)}
              onSelect={e => this.onNameSelect(e, index)}
              suggestions={this.state.suggestions}
            />
            <Field
              name={`${lineItem}.description`}
              type="text"
              component={renderField}
              label="Description"
            />
            <Field
              name={`${lineItem}.quantity`}
              component={renderNumberField}
              label="Quantity"
            />
            <Field
              name={`${lineItem}.unit_cost`}
              component={renderNumberField}
              label="Unit cost"
            />
          </div>
        ))}
      </Section>
    );
  }
}

export default LineItemsForm;
