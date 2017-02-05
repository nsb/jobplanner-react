import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Article from 'grommet/components/Article'
import BusinessForm from './BusinessForm'

class BusinessAdd extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired
  }

  render () {
    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <BusinessForm onSubmit={this.handleSubmit} />

      </Article>
    )

  }

  handleSubmit = (values) => {
    console.log(values)
    // const { token } = this.props
    // this.props.dispatch(createClient(values, token))
  }

  onClose = () => {
    this.props.dispatch(push('/'))
  }
}

const mapStateToProps = state => {
  const { auth } = state
  return {
    token: auth.token
  }
}

export default connect(mapStateToProps)(BusinessAdd)
