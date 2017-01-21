import React, { Component } from "react"
import { Sidebar, Header, Title, Button, Footer } from 'grommet'
import CloseIcon from 'grommet/components/icons/base/Close'

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
