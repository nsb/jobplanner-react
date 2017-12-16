import React from "react";
import Search from 'grommet/components/Search';
import FormField from "grommet/components/FormField";

const RenderTextField = ({
  input,
  label,
  onDomChange,
  onSelect,
  suggestions,
  meta: { touched, error, warning }
}): Element<*> => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <Search
      {...input}
      inline={true}
      fill={true}
      onDOMChange={onDomChange}
      onSelect={onSelect}
      suggestions={suggestions}
    />
  </FormField>
);

export default RenderTextField;
