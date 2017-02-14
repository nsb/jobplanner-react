import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Split from 'grommet/components/Split'
import NavSidebar from '../components/NavSidebar'
import { navToggle, navResponsive } from '../actions'

class AppAuthenticatedNav extends Component {
  static propTypes = {
    navActive: PropTypes.bool.isRequired,
    responsive: PropTypes.string.isRequired,
    business: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { business, dispatch } = this.props
    if(business === undefined) {
      dispatch(push('/404'))
    }
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
  const businessId = parseInt(ownProps.params.businessId, 10)

  return {
    navActive: nav.active,
    responsive: nav.responsive,
    business: businesses.entities.businesses[businessId]
  }
}

export default connect(mapStateToProps)(AppAuthenticatedNav)
