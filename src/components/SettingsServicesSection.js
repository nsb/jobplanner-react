// @flow

import React from "react";
import Button from "grommet/components/Button";
import EditIcon from "grommet/components/icons/base/Edit";
import SettingsListItem from "./SettingsListItem";

type Props = {
  onOpen: Function,
};

const ServicesSection = (props: Props) => {
  const { onOpen } = props;
  let control;
  control = (
    <Button icon={<EditIcon />} onClick={onOpen} a11yTitle="Edit Services" />
  );

  let details;
  details = (
    <span>
      Services are the different types of work your company offers.
    </span>
  );
  return (
    <SettingsListItem key="services" control={control} first={true}>
      <strong>Services</strong>
      {details}
    </SettingsListItem>
  );
};

export default ServicesSection;
