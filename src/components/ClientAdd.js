// @flow
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl, intlShape } from 'react-intl';
import { addSuccess, addError } from "redux-flash-messages";
import history from "../history";
import Article from "grommet/components/Article";
import ClientForm from "./ClientForm";
import { createClient } from "../actions/clients";
import type { Client } from "../actions/clients";
import type { Business } from "../actions/businesses";
import type { Field } from "../actions/fields";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  token: ?string,
  business: Business,
  fields: Array<Field>,
  isFetching: boolean,
  createClient: Function,
  onClose: Function
};

class ClientAdd extends Component<Props & { intl: intlShape }> {
  render() {
    const { fields, isFetching, onClose } = this.props;
    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>
        <ClientForm
          onSubmit={this.handleSubmit}
          fields={fields}
          onClose={onClose}
          isFetching={isFetching}
          initialValues={{
            upcoming_visit_reminder_email_enabled: true,
            address_use_property: true,
            properties: [{}]
          }}
        />
      </Article>
    );
  }

  handleSubmit = (values: Client): void => {
    const { token, business, createClient, intl } = this.props;
    if (token) {
      let action = createClient(
        business,
        {
          ...values,
          business: business.id
        },
        token
      );
      action.then((responseClient: Client) => {
        addSuccess({text: intl.formatMessage({id: "flash.saved"})});
        history.push(`/${business.id}/clients/${responseClient.id}`);
      }).catch(() => {
        addError({text: intl.formatMessage({id: "flash.error"})})
      });
    }
  };
}

type OwnProps = {
  business: Business,
  createClient: Function,
  onClose: Function
};

const mapStateToProps = (state: ReduxState, ownProps: OwnProps): Props => {
  const { auth, clients, fields, entities } = state;

  return {
    token: auth.token,
    business: ownProps.business,
    fields: fields.result
      .map((Id: number) => {
        return ensureState(entities).fields[Id];
      })
      .filter(field => {
        return field.business === ownProps.business.id;
      }),
    isFetching: clients.isFetching,
    createClient: ownProps.createClient,
    onClose: ownProps.onClose
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createClient
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ClientAdd));
