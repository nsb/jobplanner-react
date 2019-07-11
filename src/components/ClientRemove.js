// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl, FormattedMessage, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import history from "../history";
import { deleteClient } from '../actions/clients';
import LayerForm from "grommet-templates/components/LayerForm";
import Paragraph from "grommet/components/Paragraph";
import type { Client } from "../actions/clients";
import type { Dispatch } from "../types/Store";
import type { State } from '../types/State';

const intlTitle = (
  <FormattedMessage
    id="clientRemove.Title"
    description="Client remove title"
    defaultMessage="Remove"
  />
)

const intlLabel = (
  <FormattedMessage
    id="clientRemove.label"
    description="Client remove title"
    defaultMessage="Yes, remove"
  />
)

const intlParagraph = (client: Client) => (
  <FormattedMessage
    id="clientRemove.paragraph"
    description="Client remove paragraph"
    defaultMessage='Are you sure you want to remove {name}?'
    values={{name: client.is_business ? client.business_name : `${client.first_name} ${client.last_name}`}}
  />
)

type Props = {
  client: Client,
  onClose: Function,
  dispatch: Dispatch,
  token: string
};

class ClientRemove extends Component<Props & { intl: intlShape }> {

  _onRemove = () => {
    const { client, token, onClose, intl, dispatch } = this.props;
    dispatch(
      deleteClient(client, token)
    ).then((responseClient: Client) => {
      addSuccess({text: intl.formatMessage({id: "flash.deleted"})});
      history.push(`/${client.business}/clients`);
    }).catch(() => {
      addError({text: intl.formatMessage({id: "flash.error"})})
    }).finally(onClose);
  }

  render() {
    const { client, onClose } = this.props;
    return (
      <LayerForm
        title={intlTitle}
        submitLabel={intlLabel}
        compact={true}
        onClose={onClose}
        onSubmit={this._onRemove}
      >
        <fieldset>
          <Paragraph>
            {intlParagraph(client)}
          </Paragraph>
        </fieldset>
      </LayerForm>
    );
  }
}

const mapStateToProps = (
  { auth }: State,
): * => ({
  token: auth.token
});

// const mapDispatchToProps = (dispatch: *) =>
//   bindActionCreators(
//     {
//       deleteClient,
//     },
//     dispatch
//   );

export default connect(mapStateToProps)(injectIntl(ClientRemove));
