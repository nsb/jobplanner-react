// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import Article from 'grommet/components/Article';
import JobForm from './JobForm';
import {createJob} from '../actions/jobs';
import type {Business} from '../actions/businesses';
import type {State as ReduxState} from '../types/State';
import type {Dispatch} from '../types/Store';
import { ensureState } from "redux-optimistic-ui";

type Props = {
  token: string,
  business: Business,
  clients: Array<Client>,
  dispatch: Dispatch,
  push: (string) => void
};

type State = {
  scheduleLayer: boolean,
}

class JobsAdd extends Component<Props, State> {
  state = {
    scheduleLayer: false
  }

  render() {
    const {clients} = this.props;

    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <JobForm
          onSubmit={this.handleSubmit}
          onClose={this.onClose}
          clients={clients}
          initialValues={{
            begins: new Date(),
            anytime: true,
          }}
        />
      </Article>
    );
  }

  handleSubmit = values => {
    const {client: {value: clientId}} = values;
    const {token, business} = this.props;

    let action = createJob(
      business,
      {
        ...values,
        client: clientId,
      },
      token
    );
    this.props.dispatch(action);
  };

  onClose = () => {
    const {business, push} = this.props;
    push(`/${business.id}/jobs`);
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: {params: {businessId: number}},
    history: {push: string => void},
  }
) => {
  const {auth, entities, clients} = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    token: auth.token,
    business: ensureState(entities).businesses[businessId],
    clients: clients.result.map(Id => {
      return ensureState(entities).clients[Id];
    }),
    push: ownProps.history.push
  };
};

export default connect(mapStateToProps)(JobsAdd);
