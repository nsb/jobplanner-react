// @flow

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import type { State } from '../types/State'
import type { Business } from '../actions/businesses'
import Article from 'grommet/components/Article'
import BusinessForm from './BusinessForm'
import { createBusiness } from '../actions/businesses'

class BusinessAdd extends Component {
  props: {
    token: ?string
  }

  render () {
    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <BusinessForm onSubmit={this.handleSubmit} onClose={this.onClose} />

      </Article>
    )

  }

  handleSubmit = (business: Business) => {
    const { token } = this.props
    if (token)
      createBusiness(business, token)
  }

  onClose = () => {
    push('/')
  }
}

const mapStateToProps = ({ auth }: State) => ({
  token: auth.token
})

const mapDispatchToProps = (dispatch: *) => bindActionCreators({
  createBusiness,
  push
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessAdd)
