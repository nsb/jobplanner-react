// @flow

import React from "react";
import Button from "grommet/components/Button";
import EditIcon from "grommet/components/icons/base/Edit";
import SettingsListItem from "./SettingsListItem";

type Props = {
  onOpen: Function
};

const BusinessSection = (props: Props) => {
  const { onOpen } = props;
  let control;
  control = (
    <Button icon={<EditIcon />} onClick={onOpen} a11yTitle="Edit Company" />
  );

  let details;
  details = (
    <span>
      Update your company details here.
    </span>
  );
  return (
    <SettingsListItem key="business" control={control} first={true}>
      <strong>Company</strong>
      {details}
    </SettingsListItem>
  );
};

export default BusinessSection;
