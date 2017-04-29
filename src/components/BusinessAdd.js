// @flow

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push as pushActionCreator } from 'react-router-redux'
import type { State } from '../types/State'
import type { Business } from '../actions/businesses'
import Article from 'grommet/components/Article'
import BusinessForm from './BusinessForm'
import { createBusiness } from '../actions/businesses'

class BusinessAdd extends Component {
  props: {
    token: ?string,
    push: typeof pushActionCreator,
    createBusiness: (Business, string) => (d: Dispatch) => Promise<Business>
  }

  render () {
    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <BusinessForm onSubmit={this.handleSubmit} onClose={this.onClose} />

      </Article>
    )

  }

  handleSubmit = (business: Business) => {
    const { token, createBusiness } = this.props
    if (token)
      createBusiness(business, token)
  }

  onClose = () => {
    this.props.push('/')
  }
}

const mapStateToProps = ({ auth }: State) => ({
  token: auth.token
})

const mapDispatchToProps = (dispatch: *) => bindActionCreators({
  push: pushActionCreator,
  createBusiness
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessAdd)
