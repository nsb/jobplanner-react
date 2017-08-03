// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import Article from "grommet/components/Article";
import ClientForm from "./ClientForm";
import { createClient } from "../actions/clients";
import type { Client } from "../actions/clients";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";
import type { State } from "../types/State";
import { ensureState } from "redux-optimistic-ui";

class ClientAdd extends Component {
  props: {
    token: string,
    business: Business,
    dispatch: Dispatch,
    push: string => void
  };

  render() {
    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>

        <ClientForm onSubmit={this.handleSubmit} onClose={this.onClose} />

      </Article>
    );
  }

  handleSubmit = (values: Client): void => {
    const { token, business } = this.props;
    let action = createClient(
      business,
      {
        ...values,
        business: business.id
      },
      token
    );
    this.props.dispatch(action);
  };

  onClose = (e: SyntheticInputEvent) => {
    const { business, push } = this.props;
    push(`/${business.id}/clients`);
  };
}

type OwnProps = {
  match: { params: { businessId: number } },
  history: { push: string => void },
  dispatch: Dispatch
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const { auth, entities } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    token: auth.token,
    business: ensureState(entities).businesses[businessId],
    dispatch: ownProps.dispatch,
    push: ownProps.history.push
  };
};

export default connect(mapStateToProps)(ClientAdd);
