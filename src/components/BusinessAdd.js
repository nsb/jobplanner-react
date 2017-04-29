// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import type { Dispatch } from '../types/Store'
import type { State as ReduxState } from '../types/State'
import type { Business } from '../actions/businesses'
import Article from 'grommet/components/Article'
import BusinessForm from './BusinessForm'
import { createBusiness } from '../actions/businesses'

class BusinessAdd extends Component {
  props: {
    token: string,
    dispatch: Dispatch
  }

  render () {
    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <BusinessForm onSubmit={this.handleSubmit} onClose={this.onClose} />

      </Article>
    )

  }

  handleSubmit = (business: Business) => {
    const { token, dispatch } = this.props
    dispatch(createBusiness(business, token))
  }

  onClose = () => {
    this.props.dispatch(push('/'))
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Object) => {
  const { auth } = state
  return {
    token: auth.token,
    dispatch: ownProps.dispatch
  }
}

export default connect(mapStateToProps)(BusinessAdd)
