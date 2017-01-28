import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Menu from 'grommet/components/Menu'
import Anchor from 'grommet/components/Anchor'
import Box from 'grommet/components/Box'
import Heading from 'grommet/components/Heading'
import UserIcon from 'grommet/components/icons/base/User';
import { logout } from '../actions'

class SessionMenu extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    dropAlign: PropTypes.object.isRequired,
    colorIndex: PropTypes.string.isRequired
  }

  render() {
    const { user, dropAlign, colorIndex } = this.props

    return (
      <Menu icon={<UserIcon />} dropAlign={dropAlign}
        colorIndex={colorIndex} a11yTitle="Session">
        <Box pad="medium">
          <Heading tag="h3" margin="none">{user.username}</Heading>
        </Box>
        <Anchor href="#" onClick={this.onLogout} label="Logout" />
      </Menu>
    );
  }

  onLogout = () => {
    this.props.dispatch(logout())
  }
}

const mapStateToProps = state => {
  const { auth } = state

  return {
    user: auth.user
  }
}

export default connect(mapStateToProps)(SessionMenu)
