// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import Article from 'grommet/components/Article';
import JobForm from './JobForm';
import {createJob} from '../actions/jobs';
import type {Business} from '../actions/businesses';
import type {State} from '../types/State';
import type {Dispatch} from '../types/Store';

class JobsAdd extends Component {
  props: {
    token: string,
    business: Business,
    clients: Array<Client>,
    dispatch: Dispatch,
    push: (string) => void
  };

  state: {
    scheduleLayer: boolean,
  } = {
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
  state: State,
  ownProps: {
    match: {params: {businessId: number}},
    history: {push: string => void},
  }
) => {
  const {auth, entities, clients} = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    token: auth.token,
    business: entities.businesses[businessId],
    clients: clients.result.map(Id => {
      return entities.clients[Id];
    }),
    push: ownProps.history.push
  };
};

export default connect(mapStateToProps)(JobsAdd);
