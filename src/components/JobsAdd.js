// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
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
    dispatch: Dispatch
  };

  state: {
    scheduleLayer: boolean,
  };

  constructor(props) {
    super();
    this.state = {
      scheduleLayer: false,
    };
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
      {
        ...values,
        business: business.id,
        recurrences: '',
        client: clientId,
      },
      token
    );
    this.props.dispatch(action);
  };

  onClose = () => {
    const {business, dispatch} = this.props;
    dispatch(push(`/${business.id}/jobs`));
  };
}

const mapStateToProps = (
  state: State,
  ownProps: {params: {businessId: number}}
) => {
  const {auth, businesses, clients} = state;
  const businessId = parseInt(ownProps.params.businessId, 10);

  return {
    token: auth.token,
    business: businesses.entities.businesses[businessId],
    clients: clients.result.map(Id => {
      return clients.entities.clients[Id];
    }),
  };
};

export default connect(mapStateToProps)(JobsAdd);
