import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Article from 'grommet/components/Article'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import Form from 'grommet/components/Form'
import Footer from 'grommet/components/Footer'
import FormFields from 'grommet/components/FormFields'
import FormField from 'grommet/components/FormField'
import CloseIcon from 'grommet/components/icons/base/Close'
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
