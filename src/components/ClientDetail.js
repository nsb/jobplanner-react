// @flow

import React, { Component } from "react";
import Split from "grommet/components/Split";
import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Article from "grommet/components/Article";
import Anchor from "grommet/components/Anchor";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Section from "grommet/components/Section";
import MoreIcon from "grommet/components/icons/base/More";
import LinkPreviousIcon from "grommet/components/icons/base/LinkPrevious";
import ClientActions from "../components/ClientActions";
import type { Business } from "../actions/businesses";
import type { Client } from "../actions/clients";
import type { PropertiesMap } from "../actions/properties";
import type { Responsive } from "../actions/nav";

type Props = {
  business: Business,
  client: Client,
  properties: PropertiesMap,
  responsive: Responsive,
  onEdit: Function,
  onResponsive: Function
};

type State = {
  showSidebarWhenSingle: boolean
};

class ClientDetail extends Component<Props, State> {
  state = {
    showSidebarWhenSingle: false
  };

  render() {
    const { business, client, responsive, onEdit, onResponsive } = this.props;

    let onSidebarClose;
    let sidebarControl;

    if ("single" === responsive) {
      sidebarControl = (
        <Button icon={<MoreIcon />} onClick={this._onToggleSidebar} />
      );
      onSidebarClose = this._onToggleSidebar;
    }

    let sidebar;
    sidebar = (
      <ClientActions client={client} onClose={onSidebarClose} onEdit={onEdit} />
    );

    return (
      <Split
        flex="left"
        separator={true}
        priority={this.state.showSidebarWhenSingle ? "right" : "left"}
        onResponsive={onResponsive}
      >

        <div>
          <Header
            pad={{ horizontal: "small", vertical: "medium" }}
            justify="between"
            size="large"
            colorIndex="light-2"
          >
            <Box
              direction="row"
              align="center"
              pad={{ between: "small" }}
              responsive={false}
            >
              <Anchor
                icon={<LinkPreviousIcon />}
                path={`/${business.id}/clients`}
                a11yTitle="Return"
              />
              <Heading tag="h1" margin="none">
                <strong>{`Client ${client.id}`}</strong>
              </Heading>
            </Box>
            {sidebarControl}
          </Header>
          <Article pad="none" align="start" primary={true}>

            <Box full="horizontal">
              <Section pad="medium" full="horizontal">
                <Heading tag="h2" margin="none">{client.first_name}</Heading>
              </Section>
            </Box>
          </Article>
        </div>
        {sidebar}

      </Split>
    );
  }

  _onToggleSidebar = () => {
    this.setState({
      showSidebarWhenSingle: !this.state.showSidebarWhenSingle
    });
  };
}

export default ClientDetail;
