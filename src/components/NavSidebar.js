// @flow

import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import Sidebar from "grommet/components/Sidebar";
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import Menu from "grommet/components/Menu";
import Anchor from "grommet/components/Anchor";
import Button from "grommet/components/Button";
import Footer from "grommet/components/Footer";
import CloseIcon from "grommet/components/icons/base/Close";
import logo from "../logo-white.svg";
import SessionMenu from "./SessionMenu";
import type { Business } from "../actions/businesses";
import type { User } from "../actions/users";

const intlCalendar = (
  <FormattedMessage
    id="navSidebar.calendar"
    description="Navsidebar menu calendar"
    defaultMessage="Calendar"
  />
)

const intlClients = (
  <FormattedMessage
    id="navSidebar.clients"
    description="Navsidebar menu clients"
    defaultMessage="Clients"
  />
)

const intlJobs = (
  <FormattedMessage
    id="navSidebar.jobs"
    description="Navsidebar menu jobs"
    defaultMessage="Jobs"
  />
)

const intlReports = (
  <FormattedMessage
    id="navSidebar.reports"
    description="Navsidebar menu reports"
    defaultMessage="Reports"
  />
)

const intlInvoices = (
  <FormattedMessage
    id="navSidebar.invoices"
    description="Navsidebar menu invoices"
    defaultMessage="Invoices"
  />
)

const intlSettings = (
  <FormattedMessage
    id="navSidebar.settings"
    description="Navsidebar menu settings"
    defaultMessage="Settings"
  />
)

const intlIntegrations = (
  <FormattedMessage
    id="navSidebar.integrations"
    description="Navsidebar menu integrations"
    defaultMessage="Add-ons"
  />
)

type Props = {
  toggleNav: () => void,
  business: Business,
  user: User,
  logout: Function
};

class NavSidebar extends Component<Props> {
  render() {
    const { business, user, logout } = this.props;
    const colorIndex = "neutral-1";

    return (
      <Sidebar colorIndex={colorIndex} fixed={true}>
        <Header size="large" justify="between" pad={{ horizontal: "medium" }}>
          <Title a11yTitle="Close Menu">
            <img
              src={logo}
              className="App-logo"
              alt="logo"
              style={{ height: "40px" }}
            />
            <span>{business.name}</span>
          </Title>
          <Button
            icon={<CloseIcon />}
            onClick={this.props.toggleNav}
            plain={true}
            a11yTitle="Close Menu"
          />
        </Header>
        <Menu fill={true} primary={true}>
          <Anchor
            key="calendar"
            path={`/${business.id}/calendar`}
            label={intlCalendar}
          />
          <Anchor
            key="clients"
            path={`/${business.id}/clients`}
            label={intlClients}
          />
          <Anchor
            key="jobs"
            path={`/${business.id}/jobs`}
            label={intlJobs}
          />
          <Anchor
            key="reports"
            path={`/${business.id}/reports`}
            label={intlReports}
          />
          <Anchor
            key="invoices"
            path={`/${business.id}/invoices`}
            label={intlInvoices}
          />
          <Anchor
            key="settings"
            path={`/${business.id}/settings`}
            label={intlSettings}
          />
          <Anchor
            key="integrations"
            path={`/${business.id}/integrations`}
            label={intlIntegrations}
          />

        </Menu>
        <Footer pad={{ horizontal: "medium", vertical: "small" }}>
          <SessionMenu
            user={user}
            dropAlign={{ bottom: "bottom" }}
            colorIndex={colorIndex}
            logout={logout}
          />
        </Footer>
      </Sidebar>
    );
  }
}

export default injectIntl(NavSidebar);
