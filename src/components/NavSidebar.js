// @flow

import React, { Component } from "react";
import { injectIntl, intlShape } from "react-intl";
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

type Props = {
  toggleNav: () => void,
  business: Business,
  intl: intlShape,
  user: User,
  logout: Function
};

class NavSidebar extends Component<Props> {
  render() {
    const { business, intl, user, logout } = this.props;
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
            label="Calendar"
          />
          <Anchor
            key="clients"
            path={`/${business.id}/clients`}
            label={intl.formatMessage({
              id: "clients.title",
              defaultMessage: "Clients"
            })}
          />
          <Anchor key="jobs" path={`/${business.id}/jobs`} label="Jobs" />
          <Anchor
            key="reports"
            path={`/${business.id}/reports`}
            label={intl.formatMessage({
              id: "reports.title",
              defaultMessage: "Reports"
            })}
          />
          <Anchor
            key="invoices"
            path={`/${business.id}/invoices`}
            label={intl.formatMessage({
              id: "invoices.title",
              defaultMessage: "Invoices"
            })}
          />
          <Anchor
            key="settings"
            path={`/${business.id}/settings`}
            label={intl.formatMessage({
              id: "settings.title",
              defaultMessage: "Settings"
            })}
          />
          <Anchor
            key="integrations"
            path={`/${business.id}/integrations`}
            label={intl.formatMessage({
              id: "integrations.title",
              defaultMessage: "Integrations"
            })}
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
