import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Article from 'grommet/components/Article'
import ClientForm from './ClientForm'

class ClientAdd extends Component {
  static propTypes = {
    nav: PropTypes.object,
  }

  render () {
    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <ClientForm onSubmit={this.onSubmit}
          onClose={this.onClose} />

      </Article>
    )

  }

  onSubmit = (data, dispatch, props) => {
    console.log(data, props)
  }

  onClose = () => {
    this.props.dispatch(push('/clients'))
  }
}

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps)(ClientAdd)
