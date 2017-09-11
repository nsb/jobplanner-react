// @flow

import React, { Component } from "react";
import Header from "grommet/components/Header";
import Box from "grommet/components/Box";
import Sidebar from "grommet/components/Sidebar";
import Menu from "grommet/components/Menu";
import Button from "grommet/components/Button";
import SkipLinkAnchor from "grommet/components/SkipLinkAnchor";
import CloseIcon from "grommet/components/icons/base/Close";
import TaskIcon from "grommet/components/icons/base/Task";
import RevertIcon from "grommet/components/icons/base/Revert";
import EditIcon from "grommet/components/icons/base/Edit";
import TrashIcon from "grommet/components/icons/base/Trash";
import type { Job } from "../actions/jobs";

type Props = {
  job: Job,
  onToggleCloseJob: Function,
  onClose?: Function,
  onEdit: Function
};

class JobActions extends Component<Props> {
  render() {
    const { onClose, onEdit, onToggleCloseJob, job } = this.props;

    let closeControl;
    if (onClose) {
      // name = <Heading tag="h3" margin='none'>Job name</Heading>;
      closeControl = (
        <Button
          icon={<CloseIcon />}
          onClick={onClose}
          a11yTitle={`Close job name`}
        />
      );
    }

    const closeButton = job.closed
      ? <Button
          align="start"
          plain={true}
          icon={<RevertIcon />}
          label="Reopen job"
          onClick={onToggleCloseJob}
          a11yTitle={`Reopen Job`}
        />
      : <Button
          align="start"
          plain={true}
          icon={<TaskIcon />}
          label="Close job"
          onClick={onToggleCloseJob}
          a11yTitle={`Close Job`}
        />;

    return (
      <Sidebar size="medium" colorIndex="light-2">
        <SkipLinkAnchor label="Right Panel" />
        <Header
          pad={{ horizontal: "medium", vertical: "medium" }}
          justify="between"
          size="large"
        >
          {closeControl}
        </Header>
        <Box pad="medium">
          <Menu>
            <Button
              align="start"
              plain={true}
              icon={<EditIcon />}
              label="Edit"
              onClick={onEdit}
              a11yTitle={`Edit Job Name`}
            />
            {closeButton}
            <Button
              align="start"
              plain={true}
              icon={<TrashIcon />}
              label="Remove job"
              onClick={undefined}
              a11yTitle={`Remove Job Name`}
            />
          </Menu>
        </Box>
      </Sidebar>
    );
  }
}

export default JobActions;
