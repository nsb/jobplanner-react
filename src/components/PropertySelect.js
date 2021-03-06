// @flow

import React, { useState, useEffect } from "react";
import { injectIntl, FormattedMessage, intlShape } from "react-intl";
import Box from "grommet/components/Box";
import FormField from "grommet/components/FormField";
import Select from "grommet/components/Select";
import type { Property } from "../actions/properties";

const intlSelectProperty = (
  <FormattedMessage
    id="propertySelect.label"
    description="Property select label"
    defaultMessage="Select a property for the job"
  />
);

const useStateWithCallback = (initialState, callback) => {
  const [state, setState] = useState(initialState);

  useEffect(() => callback(state), [state, callback]);

  return [state, setState];
};

export type Props = {
  properties: Array<Property>,
  onSelect: (selection: { value: Property, label: string } | null) => void
};

const PropertySelect = ({ properties, onSelect }: Props & { intl: intlShape }) => {
  const [selected, setSelected] = useStateWithCallback(null, onSelect);

  const mappedProperties = properties.map(property => {
    return {
      value: property,
      label: `${property.address1}, ${property.zip_code} ${property.city}`
    };
  });

  switch (properties.length) {
    case 0:
      return null;
    case 1:
      return (
        <Box margin={{ horizontal: "none", vertical: "small" }}>
          <div>{properties[0].address1}</div>
          <div>{properties[0].address2}</div>
          <div>
            {properties[0].zip_code} {properties[0].city}
          </div>
          <div>{properties[0].country}</div>
        </Box>
      );
    default:
      return (
        <FormField label={intlSelectProperty} error={undefined}>
          <Select
            placeHolder="None"
            inline={true}
            multiple={false}
            options={mappedProperties}
            value={selected}
            onChange={({ option }) => setSelected(option)}
          />
        </FormField>
      );
  }
};

export default injectIntl(PropertySelect);
