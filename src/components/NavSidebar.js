import React, { Component, PropTypes } from "react"
import { Sidebar, Header, Title, Button, Footer } from 'grommet'
import CloseIcon from 'grommet/components/icons/base/Close'

class NavSidebar extends Component {
  static propTypes = {
    toggleNav: PropTypes.func.isRequired,
  }

  render() {

    return (
      <Sidebar colorIndex="neutral-1" fixed={true}>
        <Header size="large" justify="between" pad={{horizontal: "medium"}}>
          <Title a11yTitle="Close Menu">
            <span>JobPlanner</span>
          </Title>
          <Button icon={<CloseIcon />} onClick={this.props.toggleNav} plain={true}
            a11yTitle="Close Menu" />
        </Header>
        <Footer pad={{horizontal: "medium", vertical: "small"}}>
        </Footer>
      </Sidebar>
    )
  }
}

export default NavSidebar;
