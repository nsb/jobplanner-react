// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import Article from 'grommet/components/Article';
import ClientForm from './ClientForm';
import {createClient} from '../actions/clients';
import type {Business} from '../actions/businesses';
import type {Dispatch} from '../types/Store';
import type {State as ReduxState} from '../types/State';

type Props = {
  token: string,
  business: Business,
  dispatch: Dispatch,
};

class ClientAdd extends Component<void, Props, void> {
  render() {
    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <ClientForm onSubmit={this.handleSubmit} onClose={this.onClose} />

      </Article>
    );
  }

  handleSubmit = values => {
    const {token, business} = this.props;
    let action = createClient(
      business,
      {
        ...values,
        business: business.id,
      },
      token
    );
    this.props.dispatch(action);
  };

  onClose = (e: SyntheticInputEvent) => {
    const {business, dispatch} = this.props;
    dispatch(push(`/${business.id}/clients`));
  };
}

type OwnProps = {
  params: Object,
  dispatch: Dispatch,
};

const mapStateToProps = (state: ReduxState, ownProps: OwnProps) => {
  const {auth, businesses} = state;
  const businessId = parseInt(ownProps.params.businessId, 10);

  return {
    token: auth.token,
    business: businesses.entities.businesses[businessId],
    dispatch: ownProps.dispatch,
  };
};

export default connect(mapStateToProps)(ClientAdd);
