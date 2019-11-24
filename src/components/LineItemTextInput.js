import React from "react";
import FormField from "grommet/components/FormField";
import TextDropInput from "./TextDropInput";

const RenderTextField = ({
  input,
  label,
  onDomChange,
  onSelect,
  suggestions,
  meta: { touched, error, warning }
}): Element<*> => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <TextDropInput
      {...input}
      inline={true}
      responsive={false}
      onDOMChange={onDomChange}
      onSelect={onSelect}
      suggestions={suggestions}
    />
  </FormField>
);

export default RenderTextField;
