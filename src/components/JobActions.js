// @flow

import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
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
import JobClose from "./JobClose";
import JobRemove from "./JobRemove";
import type { Job } from "../actions/jobs";

const intlEdit = (
  <FormattedMessage
    id="jobActions.edit"
    description="Job actions edit"
    defaultMessage="Edit"
  />
);

const intlClose = (
  <FormattedMessage
    id="jobActions.close"
    description="Job actions close job"
    defaultMessage="Close job"
  />
);

const intlReopen = (
  <FormattedMessage
    id="jobActions.reopen"
    description="Job actions reopen"
    defaultMessage="Reopen job"
  />
);

const intlRemove = (
  <FormattedMessage
    id="jobActions.remove"
    description="Job actions remove"
    defaultMessage="Remove job"
  />
);

const LAYERS = {
  close: JobClose,
  remove: JobRemove
};

type Props = {
  job: Job,
  onToggleCloseJob: Function,
  onClose?: Function,
  onEdit: Function
};

type State = {
  layerName: ?string
};

class JobActions extends Component<Props, State> {
  state = {
    layerName: undefined
  }

  _onLayerOpen = (layerName: string) => {
    this.setState({ layerName });
  };

  _onLayerClose = () => {
    this.setState({ layerName: undefined });
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const { onClose, onEdit, onToggleCloseJob, job } = this.props;

    let closeControl;
    if (onClose) {
      // name = <Heading tag="h3" margin='none'>Job name</Heading>;
      closeControl = (
        <Button
          icon={<CloseIcon />}
          onClick={onClose}
          a11yTitle={intlClose}
        />
      );
    }

    let layer;
    if (this.state.layerName) {
      let Component = LAYERS[this.state.layerName];
      layer = <Component job={job} onClose={this._onLayerClose} />;
    }

    let editButton;
    if (!job.closed) {
      editButton = (
        <Button
          align="start"
          plain={true}
          icon={<EditIcon />}
          label={intlEdit}
          onClick={onEdit}
          a11yTitle={intlEdit}
        />
      );
    }

    const closeButton = job.closed
      ? <Button
          align="start"
          plain={true}
          icon={<RevertIcon />}
          label={intlReopen}
          onClick={onToggleCloseJob}
          a11yTitle={intlReopen}
        />
      : <Button
          align="start"
          plain={true}
          icon={<TaskIcon />}
          label={intlClose}
          onClick={() => this._onLayerOpen("close")}
          a11yTitle={intlClose}
        />;

    let removeButton;
    if (job.closed) {
      removeButton = (
        <Button
          align="start"
          plain={true}
          icon={<TrashIcon />}
          label={intlRemove}
          onClick={() => this._onLayerOpen("remove")}
          a11yTitle={intlRemove}
        />
      );
    }

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
            {editButton}
            {closeButton}
            {removeButton}
          </Menu>
        </Box>
        {layer}
      </Sidebar>
    );
  }
}

export default injectIntl(JobActions);
