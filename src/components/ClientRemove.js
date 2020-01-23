// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { injectIntl, FormattedMessage, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import { deleteClient } from "../actions/clients";
import LayerForm from "grommet-templates/components/LayerForm";
import Paragraph from "grommet/components/Paragraph";
import { AuthContext } from "../providers/authProvider";
import type { Client } from "../actions/clients";
import type { Dispatch } from "../types/Store";
import type { State } from "../types/State";

const intlTitle = (
  <FormattedMessage
    id="clientRemove.Title"
    description="Client remove title"
    defaultMessage="Remove"
  />
);

const intlLabel = (
  <FormattedMessage
    id="clientRemove.label"
    description="Client remove title"
    defaultMessage="Yes, remove"
  />
);

const intlParagraph = (client: Client) => (
  <FormattedMessage
    id="clientRemove.paragraph"
    description="Client remove paragraph"
    defaultMessage="Are you sure you want to remove {name}?"
    values={{
      name: client.is_business
        ? client.business_name
        : `${client.first_name} ${client.last_name}`
    }}
  />
);

type Props = {
  client: Client,
  onClose: Function,
  dispatch: Dispatch,
  history: { push: string => void}
};

class ClientRemove extends Component<Props & { intl: intlShape }> {
  static contextType = AuthContext;

  _onRemove = () => {
    const { client, onClose, intl, dispatch, history } = this.props;
    const { getUser } = this.context;

    getUser()
      .then(({ access_token }) => {
        dispatch(deleteClient(client, access_token));
      })
      .then((responseClient: Client) => {
        addSuccess({ text: intl.formatMessage({ id: "flash.deleted" }) });
        history.push(`/${client.business}/clients`);
      })
      .catch(() => {
        addError({ text: intl.formatMessage({ id: "flash.error" }) });
      })
      .finally(onClose);
  };

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
          <Paragraph>{intlParagraph(client)}</Paragraph>
        </fieldset>
      </LayerForm>
    );
  }
}

const mapStateToProps = (
  state: State,
  ownProps: { dispatch: Dispatch, history: { push: (string => void)} }
): * => ({ dispatch: ownProps.dispatch, history: ownProps.history });

// const mapDispatchToProps = (dispatch: *) =>
//   bindActionCreators(
//     {
//       deleteClient,
//     },
//     dispatch
//   );

export default withRouter(connect(mapStateToProps)(injectIntl(ClientRemove)));
