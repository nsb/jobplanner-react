// @flow

import React from "react";
import Button from "grommet/components/Button";
import EditIcon from "grommet/components/icons/base/Edit";
import SettingsListItem from "./SettingsListItem";

type Props = {
  onOpen: Function,
};

const FieldsSection = (props: Props) => {
  const { onOpen } = props;
  let control;
  control = (
    <Button icon={<EditIcon />} onClick={onOpen} a11yTitle="Edit Fields" />
  );

  let details;
  details = (
    <span>
      Specify additional fields for clients and properties.
    </span>
  );
  return (
    <SettingsListItem key="fields" control={control} first={true}>
      <strong>Fields</strong>
      {details}
    </SettingsListItem>
  );
};

export default FieldsSection;
