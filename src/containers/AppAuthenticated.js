import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { Split } from 'grommet'
import NavSidebar from '../components/NavSidebar'
import { navToggle } from '../actions'

class AppAuthenticated extends Component {
  static propTypes = {
    navActive: PropTypes.bool.isRequired,
    responsive: PropTypes.string.isRequired
  }

  render() {
    const { navActive, responsive } = this.props
    const priority = (navActive && 'single' === responsive ? 'left' : 'right')

    return (
        <Split priority={priority} flex="right" >
          {this.props.navActive ? <NavSidebar toggleNav={this.toggleNav}/> : null}
          {this.props.children}
        </Split>
    );
  }

  toggleNav = () => {
    this.props.dispatch(navToggle())
  }
}

const mapStateToProps = state => {
  const { nav } = state

  return {
    navActive: nav.active,
    responsive: nav.responsive
  }
}

export default connect(mapStateToProps)(AppAuthenticated)
