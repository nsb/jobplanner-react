// @flow

import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import Button from "grommet/components/Button";
import EditIcon from "grommet/components/icons/base/Edit";
import SettingsListItem from "./SettingsListItem";
import { Can } from "./Can";

const intlHeading = (
  <FormattedMessage
    id="settingsEmployeeSection.Heading"
    description="Settings employees heading"
    defaultMessage="Employees"
  />
);

const intlDetails = (
  <FormattedMessage
    id="settingsEmployeeSection.Details"
    description="Settings employees details"
    defaultMessage="These are your employees."
  />
);

const intlEdit = (
  <FormattedMessage
    id="settingsEmployeeSection.Edit"
    description="Settings employees edit"
    defaultMessage="Edit employees"
  />
);

type Props = {
  onOpen: Function,
};

const EmployeesSection = (props: Props) => {
  const { onOpen } = props;
  let control;
  control = (
    <Can I="update" a="Employee" passThrough>
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
    <SettingsListItem key="employees" control={control} first={true}>
      <strong>{intlHeading}</strong>
      {intlDetails}
    </SettingsListItem>
  );
};

export default injectIntl(EmployeesSection);
