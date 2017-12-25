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
    <Button icon={<EditIcon />} onClick={onOpen} a11yTitle="Edit E-mails" />
  );

  let details;
  details = (
    <span>
      These are the e-mails sent to your clients.
    </span>
  );
  return (
    <SettingsListItem key="emails" control={control} first={true}>
      <strong>E-mails</strong>
      {details}
    </SettingsListItem>
  );
};

export default ServicesSection;
