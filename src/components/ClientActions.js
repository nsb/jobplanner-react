// @flow

import React, { useState } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import Header from "grommet/components/Header";
import Box from "grommet/components/Box";
import Sidebar from "grommet/components/Sidebar";
import Menu from "grommet/components/Menu";
import Button from "grommet/components/Button";
import SkipLinkAnchor from "grommet/components/SkipLinkAnchor";
import CloseIcon from "grommet/components/icons/base/Close";
import EditIcon from "grommet/components/icons/base/Edit";
import MoneyIcon from "grommet/components/icons/base/Money";
import TrashIcon from "grommet/components/icons/base/Trash";
import { Can } from "./Can";
import ClientRemove from "./ClientRemove";
import type { Client } from "../actions/clients";

const intlEdit = (
  <FormattedMessage
    id="clientActions.edit"
    description="Client actions edit"
    defaultMessage="Edit"
  />
);

const intlInvoice = (
  <FormattedMessage
    id="clientActions.invoice"
    description="Client actions invoice"
    defaultMessage="Invoice"
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
  remove: ClientRemove,
};

type Props = {
  client: Client,
  onClose?: () => void,
  onEdit: () => void,
  onInvoice: () => void,
};

const ClientActions = ({ client, onEdit, onInvoice, onClose }: Props) => {
  const [layerName, setLayerName] = useState(undefined);

  let closeControl;
  if (onClose) {
    closeControl = (
      <Button
        icon={<CloseIcon />}
        onClick={onClose}
        a11yTitle={`Close job name`}
      />
    );
  }

  let layer;
  if (layerName) {
    let Component = LAYERS[layerName];
    layer = (
      <Component client={client} onClose={() => setLayerName(undefined)} />
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
          <Can I="update" a="Client">
            <Button
              align="start"
              plain={true}
              icon={<EditIcon />}
              label={intlEdit}
              onClick={onEdit}
              a11yTitle={intlEdit}
            />
          </Can>
          <Can I="create" a="Invoice">
            <Button
              align="start"
              plain={true}
              icon={<MoneyIcon />}
              label={intlInvoice}
              onClick={onInvoice}
              a11yTitle={intlInvoice}
            />
          </Can>
          <Can I="delete" a="Client">
            <Button
              align="start"
              plain={true}
              icon={<TrashIcon />}
              label={intlRemove}
              onClick={() => setLayerName("remove")}
              a11yTitle={intlRemove}
            />
          </Can>
        </Menu>
      </Box>
      {layer}
    </Sidebar>
  );
};

export default injectIntl(ClientActions);
