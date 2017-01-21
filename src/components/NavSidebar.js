// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from "react";
import { Sidebar, Header, Title, Button, CloseIcon, Footer } from 'grommet'

class NavSidebar extends Component {

  render() {

    return (
      <Sidebar colorIndex="neutral-1" fixed={true}>
        <Header size="large" justify="between" pad={{horizontal: "medium"}}>
          <Title a11yTitle="Close Menu">
            <span>JobPlanner</span>
          </Title>
          <Button icon={<CloseIcon />} onClick={this.onClose} plain={true}
            a11yTitle="Close Menu" />
        </Header>
        <Footer pad={{horizontal: "medium", vertical: "small"}}>
        </Footer>
      </Sidebar>
    )
  }

  onClose = () => {
    console.log('onClose')
  }

}

export default NavSidebar;
