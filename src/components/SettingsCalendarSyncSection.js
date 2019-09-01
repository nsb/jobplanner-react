// @flow

import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import Button from "grommet/components/Button";
import EditIcon from "grommet/components/icons/base/Edit";
import SettingsListItem from "./SettingsListItem";

const intlHeading = (
  <FormattedMessage
    id="settingsCalendarSyncSection.heading"
    description="Settings calendar sync section heading"
    defaultMessage="Calendar Sync"
  />
)

const intlDetails = (
  <FormattedMessage
    id="settingsCalendarSyncSection.details"
    description="Settings calendar sync section details"
    defaultMessage="Set Up Calendar Sync."
  />
)

type Props = {
  onOpen: Function
};

const CalendarSyncSection = (props: Props) => {
  const { onOpen } = props;
  let control;
  control = (
    <Button icon={<EditIcon />} onClick={onOpen} a11yTitle="Calendar Sync" />
  );

  return (
    <SettingsListItem key="business" control={control} first={true}>
      <strong>{intlHeading}</strong>
      {intlDetails}
    </SettingsListItem>
  );
};

export default injectIntl(CalendarSyncSection);
