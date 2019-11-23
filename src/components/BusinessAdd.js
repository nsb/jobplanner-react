// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl, intlShape } from 'react-intl';
import { addSuccess, addError } from "redux-flash-messages";
import history from "../history";
import type { State as ReduxState } from "../types/State";
import type { Business } from "../actions/businesses";
import Article from "grommet/components/Article";
import BusinessForm from "./BusinessForm";
import { createBusiness } from "../actions/businesses";
import type { PromiseAction } from "../types/Store";

type Props = {
  token: ?string,
  push: string => void,
  createBusiness: (Business, string) => PromiseAction
}

type State = {}

class BusinessAdd extends Component<Props & { intl: intlShape }, State> {

  render() {
    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>

        <BusinessForm onSubmit={this.handleSubmit} onClose={this.onClose} />

      </Article>
    );
  }

  handleSubmit = (business: Business) => {
    const { token, createBusiness, intl } = this.props;
    if (token) {
      createBusiness(business, token).then((responseBusiness: Business) => {
        addSuccess({text: intl.formatMessage({id: "flash.saved"})})
        history.push(`/${responseBusiness.id}`);
      }).catch(() => {
        addError({text: intl.formatMessage({id: "flash.error"})})
      });
    };
  };

  onClose = () => {
    this.props.push("/");
  };
}

const mapStateToProps = (
  { auth, businesses }: ReduxState,
  ownProps: { history: { push: string => void }, createBusiness: (Business, string) => Promise<any> }
) => ({
  token: auth.token,
  push: ownProps.history.push,
  createBusiness: ownProps.createBusiness,
  isFetching: businesses.isFetching
});

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators(
    {
      createBusiness
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BusinessAdd));
