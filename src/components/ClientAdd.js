import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Article from 'grommet/components/Article'
import ClientForm from './ClientForm'
import { createClient } from '../actions'

class ClientAdd extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired
  }

  render () {
    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <ClientForm onSubmit={this.handleSubmit}
          onClose={this.onClose} />

      </Article>
    )

  }

  handleSubmit = (values) => {
    const { token } = this.props
    this.props.dispatch(createClient(values, token))
  }

  onClose = () => {
    this.props.dispatch(push('/clients'))
  }
}

const mapStateToProps = state => {
  const { auth } = state
  return {
    token: auth.token
  }
}

export default connect(mapStateToProps)(ClientAdd)
