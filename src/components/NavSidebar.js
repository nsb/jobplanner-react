import React, { Component, PropTypes } from "react"
import { Sidebar, Header, Title, Menu, Anchor, Button, Footer } from 'grommet'
import CloseIcon from 'grommet/components/icons/base/Close'
import logo from '../logo.svg'

class NavSidebar extends Component {
  static propTypes = {
    toggleNav: PropTypes.func.isRequired,
  }

  render() {

    return (
      <Sidebar colorIndex="neutral-1" fixed={true}>
        <Header size="large" justify="between" pad={{horizontal: "medium"}}>
          <Title a11yTitle="Close Menu">
            <img src={logo} className="App-logo" alt="logo" style={{height : '40px'}} />
            <span>JobPlanner</span>
          </Title>
          <Button icon={<CloseIcon />} onClick={this.props.toggleNav} plain={true}
            a11yTitle="Close Menu" />
        </Header>
        <Menu fill={true} primary={true}>
          <Anchor key="dashboard" path="/" label="Dashboard" />
          <Anchor key="calendar" path="/calendar" label="Calendar" />
          <Anchor key="clients" path="/clients" label="Clients" />
          <Anchor key="work" path="/work" label="Work" />
        </Menu>
        <Footer pad={{horizontal: "medium", vertical: "small"}}>
        </Footer>
      </Sidebar>
    )
  }
}

export default NavSidebar;
