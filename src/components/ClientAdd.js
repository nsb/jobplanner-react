// @flow
import React, { Component } from "react";
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
  dispatch: Dispatch,
  push: string => void,
  isFetching: boolean
};

class ClientAdd extends Component<Props & { intl: intlShape }> {
  render() {
    const { fields, isFetching } = this.props;
    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>
        <ClientForm
          onSubmit={this.handleSubmit}
          fields={fields}
          onClose={this.onClose}
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
    const { token, business, dispatch, intl } = this.props;
    if (token) {
      let action = createClient(
        business,
        {
          ...values,
          business: business.id
        },
        token
      );
      dispatch(action).then((responseClient: Client) => {
        addSuccess({text: intl.formatMessage({id: "flash.saved"})});
        history.push(`/${business.id}/clients/${responseClient.id}`);
      }).catch(() => {
        addError({text: intl.formatMessage({id: "flash.error"})})
      });
    }
  };

  onClose = (e: SyntheticInputEvent<*>) => {
    const { business, push } = this.props;
    push(`/${business.id}/clients`);
  };
}

type OwnProps = {
  match: { params: { businessId: number } },
  history: { push: string => void },
  dispatch: Dispatch
};

const mapStateToProps = (state: ReduxState, ownProps: OwnProps): Props => {
  const { auth, clients, fields, entities } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    token: auth.token,
    business: ensureState(entities).businesses[businessId],
    fields: fields.result
      .map((Id: number) => {
        return ensureState(entities).fields[Id];
      })
      .filter(field => {
        return field.business === businessId;
      }),
    dispatch: ownProps.dispatch,
    push: ownProps.history.push,
    isFetching: clients.isFetching
  };
};

export default connect(mapStateToProps)(injectIntl(ClientAdd));
