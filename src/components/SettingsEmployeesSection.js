// @flow

import React from "react";
import Button from "grommet/components/Button";
import EditIcon from "grommet/components/icons/base/Edit";
import SettingsListItem from "./SettingsListItem";

type Props = {
  onOpen: Function,
};

const EmployeesSection = (props: Props) => {
  const { onOpen } = props;
  let control;
  control = (
    <Button icon={<EditIcon />} onClick={onOpen} a11yTitle="Edit Employees" />
  );

  let details;
  details = (
    <span>
      These are your employees.
    </span>
  );
  return (
    <SettingsListItem key="employees" control={control} first={true}>
      <strong>Employees</strong>
      {details}
    </SettingsListItem>
  );
};

export default EmployeesSection;
