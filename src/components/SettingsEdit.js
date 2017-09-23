// @flow

import React, { Component } from "react";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import List from "grommet/components/List";
import NavControl from "./NavControl";
import BusinessSection from "./SettingsBusinessSection";
import SettingsServicesSection from "./SettingsServicesSection";

class Settings extends Component<*> {
  render() {
    return (
      <Box>
        <Header size="large" pad={{ horizontal: "medium" }}>
          <Title responsive={false}>
            <NavControl />
            <span>Settings</span>
          </Title>
        </Header>
        <List>
          <BusinessSection />
          <SettingsServicesSection productName="Services" />
        </List>
      </Box>
    );
  }
}

export default Settings;
