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
import AddIcon from "grommet/components/icons/base/Add";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";
import RenderTextField from "./LineItemTextInput";
import Label from "grommet/components/Label";
import type { Service } from "../actions/services";
import type { Fields } from "redux-form/lib/FieldArrayProps.types";

const intlAddButton = (
  <FormattedMessage
    id="lineItemsForm.addButton"
    description="Line items add button"
    defaultMessage="Add Line item"
  />
);

const intlLineItem = (index: number) => (
  <FormattedMessage
    id="lineItemsForm.lineItemIndex"
    description="Line items index"
    defaultMessage="Line item #{index}"
    values={{ index }}
  />
);

const intlName = (
  <FormattedMessage
    id="lineItemsForm.nameLabel"
    description="Line items name label"
    defaultMessage="Name"
  />
);

const intlDescription = (
  <FormattedMessage
    id="lineItemsForm.descriptionLabel"
    description="Line items description label"
    defaultMessage="Description"
  />
);

const intlQuantity = (
  <FormattedMessage
    id="lineItemsForm.quantityLabel"
    description="Line items quantity label"
    defaultMessage="Quantity"
  />
);

const intlUnitCost = (
  <FormattedMessage
    id="lineItemsForm.unitCostLabel"
    description="Line items unit cost label"
    defaultMessage="Unit cost ex. VAT"
  />
);

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>
);

const renderNumberField = ({
  input,
  label,
  meta: { touched, error, warning }
}) => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <NumberInput {...input} />
  </FormField>
);

export type VisitLineItemProps = {
  formName: string,
  suggestions: Array<{ label: string, value: Service }>,
  fields: Fields,
  meta: { dirty: boolean, error: ?string, submitFailed: boolean },
  change: Function
};

type Suggestion = { label: string, value: Service };

type LineItemState = {
  value: string,
  suggestions: Array<Suggestion>
};

class VisitLineItemsForm extends Component<
  VisitLineItemProps & { intl: intlShape },
  LineItemState
> {
  constructor(props: VisitLineItemProps) {
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
    const {
      change,
      formName,
      fields,
      meta: { error, submitFailed }
    } = this.props;

    return (
      <Section>
        {fields.map((lineItem, index) => {
          const quantity = fields.get(index).quantity;
          return fields.get(index).line_item ? (
            <Box
              margin={{ bottom: "medium" }}
              pad={"small"}
              colorIndex="light-2"
            >
              <div key={index}>
                <Heading tag="h4" margin="none" strong="true">
                  {fields.get(index).name}
                  <Button
                  icon={quantity ? <CloseIcon /> : <AddIcon />}
                  onClick={() =>
                    change(
                      formName,
                      `line_items[${index}].quantity`,
                      quantity ? 0 : 1
                    )
                  }
                  href="#"
                  primary={false}
                  accent={false}
                  plain={true}
                />
                </Heading>
                <Paragraph margin="small">
                  {fields.get(index).description}
                </Paragraph>
                {fields.get(index).quantity ? (
                  <Field
                    name={`${lineItem}.quantity`}
                    component={renderNumberField}
                    label={intlQuantity}
                  />
                ) : (
                  <div>
                    <Label>{intlQuantity}</Label> {fields.get(index).quantity}
                  </div>
                )}
                <List>
        <ListItem justify="between" pad={{horizontal: "none", vertical: "medium"}}>
                    <span>{intlUnitCost}</span>
                    <span>{fields.get(index).unit_cost}</span>
                  </ListItem>
                </List>
              </div>
            </Box>
          ) : (
            <Box
              margin={{ bottom: "medium" }}
              pad={"small"}
              colorIndex="light-2"
            >
              <div key={index}>
                {intlLineItem(index + 1)}
                <Button
                  icon={<CloseIcon />}
                  onClick={() => fields.remove(index)}
                  href="#"
                  primary={false}
                  accent={false}
                  plain={true}
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
          );
        })}
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

export default injectIntl(VisitLineItemsForm);
