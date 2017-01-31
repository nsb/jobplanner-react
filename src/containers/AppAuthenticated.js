import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import Split from 'grommet/components/Split'
import Article from 'grommet/components/Article'
import Section from 'grommet/components/Section'
import logo from '../logo.svg'
import NavSidebar from '../components/NavSidebar'
import { navToggle, navResponsive, verify } from '../actions'

class AppAuthenticated extends Component {
  static propTypes = {
    navActive: PropTypes.bool.isRequired,
    responsive: PropTypes.string.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    token: PropTypes.string.isRequired
  }

  componentWillMount () {
    const { isAuthenticated, token } = this.props

    if (!isAuthenticated) {
      this.props.dispatch(verify(token))
    }
  }

  render() {
    const { navActive, responsive, isAuthenticated } = this.props
    const priority = (navActive && 'single' === responsive ? 'left' : 'right')

    if (isAuthenticated) {
      return (
          <Split priority={priority} flex="right"
            onResponsive={this.onResponsive} >
            {this.props.navActive ? <NavSidebar toggleNav={this.toggleNav}/> : null}
            {this.props.children}
          </Split>
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

  onResponsive = (responsive) => {
    this.props.dispatch(navResponsive(responsive))
  }

  toggleNav = () => {
    this.props.dispatch(navToggle())
  }
}

const mapStateToProps = state => {
  const { nav, auth } = state

  return {
    navActive: nav.active,
    isAuthenticated: auth.isAuthenticated,
    token: auth.token,
    responsive: nav.responsive
  }
}

export default connect(mapStateToProps)(AppAuthenticated)
