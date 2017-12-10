import React from "react";
import onClickOutside from "react-onclickoutside";
import TextInput from "grommet/components/TextInput";
import FormField from "grommet/components/FormField";

class LineItemTextInput extends TextInput {
  handleClickOutside = event => this._onRemoveDrop();

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
    document.removeEventListener("click", this._onRemoveDrop);
  }

  _onFocus = event => this._onInputChange(event);
}

const ClickOutsideLineItemTextInput = onClickOutside(LineItemTextInput);

const RenderTextField = ({
  input,
  label,
  onDomChange,
  onSelect,
  suggestions,
  value,
  meta: { touched, error, warning }
}): Element<*> => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <ClickOutsideLineItemTextInput
      {...input}
      onDOMChange={onDomChange}
      onSelect={onSelect}
      suggestions={suggestions}
      value={value}
    />
  </FormField>
);

export default RenderTextField;
