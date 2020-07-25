// @flow

import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import Button from "grommet/components/Button";
import EditIcon from "grommet/components/icons/base/Edit";
import SettingsListItem from "./SettingsListItem";
import { Can } from "./Can";

const intlHeading = (
  <FormattedMessage
    id="settingsBusinessSection.heading"
    description="Settings business section heading"
    defaultMessage="Company"
  />
);

const intlDetails = (
  <FormattedMessage
    id="settingsBusinessSection.details"
    description="Settings business section details"
    defaultMessage="Update your company details here."
  />
);

type Props = {
  onOpen: Function,
};

const BusinessSection = (props: Props) => {
  const { onOpen } = props;
  let control;
  control = (
    <Can I="update" a="Business" passThrough>
      {(allowed) => (
        <Button
          icon={<EditIcon />}
          onClick={allowed ? onOpen : undefined}
          a11yTitle="Edit Company"
        />
      )}
    </Can>
  );

  return (
    <SettingsListItem key="business" control={control} first={true}>
      <strong>{intlHeading}</strong>
      {intlDetails}
    </SettingsListItem>
  );
};

export default injectIntl(BusinessSection);
