// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import { injectIntl, intlShape } from 'react-intl';
import { addSuccess, addError } from "redux-flash-messages";
import history from "../history";
import { clientSchema } from "../schemas";
import Article from "grommet/components/Article";
import ClientForm from "./ClientForm";
import { updateClient } from "../actions/clients";
import type { Business } from "../actions/businesses";
import type { Client } from "../actions/clients";
import type { Field } from "../actions/fields";
import type { State } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { PropertiesMap } from "../actions/properties";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  token: ?string,
  business: Business,
  client: Client,
  fields: Array<Field>,
  properties: PropertiesMap,
  push: string => void,
  dispatch: Dispatch,
  isFetching: boolean
};

class ClientEdit extends Component<Props & { intl: intlShape }> {
  render() {
    const { client, fields, isFetching } = this.props;

    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>
        <ClientForm
          onSubmit={this.handleSubmit}
          onClose={this.onClose}
          fields={fields}
          initialValues={client}
          isFetching={isFetching}
        />
      </Article>
    );
  }

  handleSubmit = (values: Client): void => {
    const { token, client, dispatch, intl } = this.props;
    dispatch(
      updateClient(
        {
          ...client,
          ...values
        },
        token || ""
      )
    ).then((responseClient: Client) => {
      addSuccess({text: intl.formatMessage({id: "flash.saved"})});
      history.push(`/${client.business}/clients/${responseClient.id}`);
    }).catch(() => {
      addError({text: intl.formatMessage({id: "flash.error"})})
    });
  };

  onClose = () => {
    const { business, client, push } = this.props;
    push(`/${business.id}/clients/${client.id}`);
  };
}

const mapStateToProps = (
  state: State,
  ownProps: {
    match: { params: { businessId: number, clientId: number } },
    history: { push: string => void },
    dispatch: Dispatch
  }
): Props => {
  const { auth, fields, entities, clients } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const clientId = parseInt(ownProps.match.params.clientId, 10);

  return {
    token: auth.token,
    business: ensureState(entities).businesses[businessId],
    client: denormalize(
      ensureState(entities).clients[clientId],
      clientSchema,
      ensureState(entities)
    ),
    fields: fields.result
      .map((Id: number) => {
        return ensureState(entities).fields[Id];
      })
      .filter(field => {
        return field.business === businessId;
      }),
    properties: ensureState(entities).properties,
    push: ownProps.history.push,
    dispatch: ownProps.dispatch,
    isFetching: clients.isFetching
  };
};

export default connect(mapStateToProps)(injectIntl(ClientEdit));
