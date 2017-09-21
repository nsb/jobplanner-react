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
import JobList from "../components/JobList";
import type { Business } from "../actions/businesses";
import type { Client } from "../actions/clients";
import type { Property } from "../actions/properties";
import type { PropertiesMap } from "../actions/properties";
import type { Responsive } from "../actions/nav";

type Props = {
  business: Business,
  client: Client,
  properties: PropertiesMap,
  responsive: Responsive,
  onEdit: Function,
  onResponsive: Function,
  push: string => void
};

type State = {
  showSidebarWhenSingle: boolean
};

class ClientDetail extends Component<Props, State> {
  state = {
    showSidebarWhenSingle: false
  };

  render() {
    const {
      business,
      client,
      properties,
      responsive,
      onEdit,
      onResponsive,
      push
    } = this.props;

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
              <Heading tag="h3" margin="none">
                <strong>{`${client.first_name} ${client.last_name}`}</strong>
              </Heading>
            </Box>
            {sidebarControl}
          </Header>
          <Article pad="none" align="start" primary={true}>
            <Section pad="medium" full="horizontal">
              <Heading tag="h4" margin="none">Properties</Heading>
              {properties.map((property: Property, index: number) => {
                return (
                  <div>
                    <div>{property.address1}</div>
                    <div>{property.address2}</div>
                    <div>{property.zip_code}</div>
                    <div>{property.country}</div>
                  </div>
                );
              })}
            </Section>
            <Section pad="medium" full="horizontal">
              <JobList businessId={business.id} push={push} />
            </Section>
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
