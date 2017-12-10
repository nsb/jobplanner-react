import React, { Component } from "react";
import { Field } from "redux-form";
import Section from "grommet/components/Section";
import FormField from "grommet/components/FormField";
import NumberInput from "grommet/components/NumberInput";
import RenderTextField from "./LineItemTextInput";

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

type LineItemProps = {
  fields: Object,
  meta: { error: boolean, submitFailed: boolean }
};

type LineItemState = {
  value: *,
  suggestions: *
};

const VALUES = ["one", "two", "three", "four", "five", "six", "seven", "eight"];

// suggestions={[
//   {
//     value: "first",
//     sub: "alpha",
//     label: (
//       <Box direction="row" justify="between">
//         {" "}
//         <span> first </span>{" "}
//         <span className="secondary"> alpha </span>
//       </Box>
//     )
//   }
// ]}

export default class LineItems extends Component<LineItemProps, LineItemState> {
  constructor(props: LineItemProps) {
    super();
    this.state = { value: "", suggestions: VALUES };
  }

  _onDOMChange = event => {
    if (event.target.value) {
      const regexp = new RegExp("^" + event.target.value);
      const suggestions = VALUES.filter(val => {
        return regexp.test(val);
      });
      this.setState({ value: event.target.value, suggestions: suggestions });
    } else {
      this.setState({ value: "", suggestions: VALUES });
    }
  };

  _onSelect = pseudoEvent => {
    this.setState({ value: pseudoEvent.suggestion, suggestions: VALUES });
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
              onDomChange={this._onDOMChange}
              onSelect={this._onSelect}
              value={this.state.value}
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
