// @flow

import React from "react";
import {injectIntl, FormattedMessage} from 'react-intl';
import Button from "grommet/components/Button";
import EditIcon from "grommet/components/icons/base/Edit";
import SettingsListItem from "./SettingsListItem";

const intlHeading = (
  <FormattedMessage
    id="settingsServicesSection.heading"
    description="Settings services section heading"
    defaultMessage="Services"
  />
)

const intlDetails = (
  <FormattedMessage
    id="settingsServicesSection.details"
    description="Settings services section details"
    defaultMessage="Services are the different types of work your company offers."
  />
)

const intlEdit = (
  <FormattedMessage
    id="settingsServicesSection.edit"
    description="Settings services section edit"
    defaultMessage="Edit services."
  />
)

type Props = {
  onOpen: Function,
};

const ServicesSection = (props: Props) => {
  const { onOpen } = props;
  let control;
  control = (
    <Button icon={<EditIcon />} onClick={onOpen} a11yTitle={intlEdit} />
  );

  return (
    <SettingsListItem key="services" control={control} first={true}>
      <strong>{intlHeading}</strong>
      {intlDetails}
    </SettingsListItem>
  );
};

export default injectIntl(ServicesSection);
