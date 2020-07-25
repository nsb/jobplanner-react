// @flow

import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import Button from "grommet/components/Button";
import EditIcon from "grommet/components/icons/base/Edit";
import SettingsListItem from "./SettingsListItem";
import { Can } from "./Can";

const intlHeading = (
  <FormattedMessage
    id="settingsEmailSection.heading"
    description="Settings email section heading"
    defaultMessage="E-mails"
  />
);

const intlDetails = (
  <FormattedMessage
    id="settingsEmailSection.details"
    description="Settings email section details"
    defaultMessage="These are the e-mails sent to your clients."
  />
);

const intlEdit = (
  <FormattedMessage
    id="settingsEmailSection.edit"
    description="Settings email section edit"
    defaultMessage="Edit e-mails."
  />
);

type Props = {
  onOpen: Function,
};

const ServicesSection = (props: Props) => {
  const { onOpen } = props;
  let control;
  control = (
    <Can I="update" a="Business" passThrough>
      {(allowed) => (
        <Button
          icon={<EditIcon />}
          onClick={allowed ? onOpen : undefined}
          a11yTitle={intlEdit}
        />
      )}
    </Can>
  );

  return (
    <SettingsListItem key="emails" control={control} first={true}>
      <strong>{intlHeading}</strong>
      {intlDetails}
    </SettingsListItem>
  );
};

export default injectIntl(ServicesSection);
