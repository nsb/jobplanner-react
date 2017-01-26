import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Menu, Anchor, Box, Heading } from 'grommet'
import UserIcon from 'grommet/components/icons/base/User';

class SessionMenu extends Component {
  static propTypes = {
    user: PropTypes.object,
    dropAlign: PropTypes.object.isRequired,
    colorIndex: PropTypes.string.isRequired
  }

  render() {
    const { dropAlign, colorIndex } = this.props

    return (
      <Menu icon={<UserIcon />} dropAlign={dropAlign}
        colorIndex={colorIndex} a11yTitle="Session">
        <Box pad="medium">
          <Heading tag="h3" margin="none">"Niels"</Heading>
        </Box>
        <Anchor href="#" onClick={null} label="Logout" />
      </Menu>
    );
  }

}

const mapStateToProps = state => {
  const { login } = state

  return {
    user: login.user
  }
}

export default connect(mapStateToProps)(SessionMenu)
