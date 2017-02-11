import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Article from 'grommet/components/Article'
import Section from 'grommet/components/Section'
import logo from '../logo.svg'
import { fetchBusinesses } from '../actions'

class AppAuthenticatedBusiness extends Component {
  static propTypes = {
    businesses: PropTypes.array.isRequired
  }

  componentWillMount () {
    // const { businesses, params, dispatch, token } = this.props
    // let business = businesses.find(
    //   business => business.id === parseInt(params.businessId, 10))
    const { dispatch, token } = this.props
    dispatch(fetchBusinesses(token))
  }

  render() {

    const { businesses } = this.props

    if (businesses.length) {
      return (
        <div>
          {this.props.children}
        </div>
      )
    } else {
      return (
        <Article scrollStep={true} controls={true}>
          <Section full={true}
            colorIndex="dark" texture="url(img/ferret_background.png)"
            pad="large" justify="center" align="center">
            <img src={logo} className="App-logo" alt="logo" />
          </Section>
        </Article>
      )
    }
  }
}

const mapStateToProps = state => {
  const { businesses, auth } = state

  return {
    businesses: businesses,
    token: auth.token
  }
}

export default connect(mapStateToProps)(AppAuthenticatedBusiness)
