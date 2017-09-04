// @flow

import React, { Component } from "react";
import Header from "grommet/components/Header";
import Box from "grommet/components/Box";
import Sidebar from "grommet/components/Sidebar";
import Menu from "grommet/components/Menu";
import Button from "grommet/components/Button";
import SkipLinkAnchor from "grommet/components/SkipLinkAnchor";
import CameraIcon from "grommet/components/icons/base/Camera";
import CloseIcon from "grommet/components/icons/base/Close";
import EditIcon from "grommet/components/icons/base/Edit";
import TrashIcon from "grommet/components/icons/base/Trash";
import ClientRemove from "./ClientRemove";
import type { Client } from "../actions/clients";

const LAYERS = {
  remove: ClientRemove
};

type Props = {
  client: Client,
  onClose?: Function,
  onEdit: Function
};

type State = {
  layerName: ?string
};


class ClientActions extends Component<Props, State> {
  state = {
    layerName: undefined
  };

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
    const { client, onClose, onEdit } = this.props;

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

    let layer;
    if (this.state.layerName) {
      let Component = LAYERS[this.state.layerName];
      layer = <Component client={client} onClose={this._onLayerClose} />;
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
            <Button
              align="start"
              plain={true}
              icon={<CameraIcon />}
              label="Take Snapshot"
              onClick={undefined}
            />
            <Button
              align="start"
              plain={true}
              icon={<EditIcon />}
              label="Edit"
              onClick={onEdit}
              a11yTitle={`Edit Job Name`}
            />
            <Button
              align="start"
              plain={true}
              icon={<TrashIcon />}
              label="Remove"
              onClick={() => this._onLayerOpen("remove")}
              a11yTitle={`Remove Job Name`}
            />
          </Menu>
        </Box>
        {layer}
      </Sidebar>
    );
  }
}

export default ClientActions;
