import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import Split from 'grommet/components/Split'
import NavSidebar from '../components/NavSidebar'
import { navToggle, navResponsive } from '../actions'

class AppAuthenticatedNav extends Component {
  static propTypes = {
    navActive: PropTypes.bool.isRequired,
    responsive: PropTypes.string.isRequired,
    business: PropTypes.object.isRequired
  }

  render() {
    const { navActive, responsive } = this.props
    const priority = (navActive && 'single' === responsive ? 'left' : 'right')

    const { business } = this.props

    return (
        <Split priority={priority} flex="right"
          onResponsive={this.onResponsive} >
          {this.props.navActive ? <NavSidebar toggleNav={this.toggleNav} business={business} /> : null}
          {this.props.children}
        </Split>
    )
  }

  onResponsive = (responsive) => {
    this.props.dispatch(navResponsive(responsive))
  }

  toggleNav = () => {
    this.props.dispatch(navToggle())
  }
}

const mapStateToProps = (state, ownProps) => {
  const { nav, businesses } = state

  return {
    navActive: nav.active,
    responsive: nav.responsive,
    business: businesses.items.find(business => business.id === parseInt(ownProps.params.businessId, 10))
  }
}

export default connect(mapStateToProps)(AppAuthenticatedNav)
