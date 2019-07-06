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
import EditIcon from "grommet/components/icons/base/Edit";
import TrashIcon from "grommet/components/icons/base/Trash";
import ClientRemove from "./ClientRemove";
import type { Client } from "../actions/clients";

const intlEdit = (
  <FormattedMessage
    id="clientActions.edit"
    description="Client actions edit"
    defaultMessage="Edit"
  />
);

const intlRemove = (
  <FormattedMessage
    id="clientActions.remove"
    description="Client actions remove"
    defaultMessage="Remove"
  />
);


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
              icon={<EditIcon />}
              label={intlEdit}
              onClick={onEdit}
              a11yTitle={intlEdit}
            />
            <Button
              align="start"
              plain={true}
              icon={<TrashIcon />}
              label={intlRemove}
              onClick={() => this._onLayerOpen("remove")}
              a11yTitle={intlRemove}
            />
          </Menu>
        </Box>
        {layer}
      </Sidebar>
    );
  }
}

export default injectIntl(ClientActions);
