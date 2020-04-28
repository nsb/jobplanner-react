// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import { injectIntl, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import { clientSchema } from "../schemas";
import Article from "grommet/components/Article";
import ClientForm from "./ClientForm";
import { AuthContext } from "../providers/authProvider";
import { updateClient } from "../actions/clients";
import type { Business } from "../actions/businesses";
import type { Client } from "../actions/clients";
// import type { Field } from "../actions/fields";
import type { State } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { PropertiesMap } from "../actions/properties";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  business: Business,
  client: Client,
  // fields: Array<Field>,
  properties: PropertiesMap,
  isFetching: boolean,
  updateClient: Function,
  onClose: Function
};

class ClientEdit extends Component<Props & { intl: intlShape }> {
  static contextType = AuthContext;

  render() {
    const { client, isFetching, onClose } = this.props;

    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>
        <ClientForm
          onSubmit={this.handleSubmit}
          onClose={onClose}
          initialValues={client}
          isFetching={isFetching}
        />
      </Article>
    );
  }

  handleSubmit = (values: Client): void => {
    const { client, intl, updateClient, onClose } = this.props;

    const { getUser } = this.context;
    getUser().then(({ access_token }) => {
      return updateClient(
        {
          ...client,
          ...values
        },
        access_token || ""
      )
    }).then((responseClient: Client) => {
      addSuccess({ text: intl.formatMessage({ id: "flash.saved" }) });
      onClose();
    })
    .catch(() => {
      addError({ text: intl.formatMessage({ id: "flash.error" }) });
    });
  };
}

const mapStateToProps = (
  state: State,
  ownProps: {
    updateClient: Function,
    onClose: Function,
    client: Client
  }
): Props => {
  const { entities, clients } = state;

  return {
    business: ensureState(entities).businesses[ownProps.client.business],
    client: denormalize(
      ensureState(entities).clients[ownProps.client.id],
      clientSchema,
      ensureState(entities)
    ),
    // fields: fields.result
    //   .map((Id: number) => {
    //     return ensureState(entities).fields[Id];
    //   })
    //   .filter(field => {
    //     return field.business === ownProps.client.business;
    //   }),
    properties: ensureState(entities).properties,
    isFetching: clients.isFetching,
    updateClient: ownProps.updateClient,
    onClose: ownProps.onClose
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      updateClient
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(ClientEdit));
