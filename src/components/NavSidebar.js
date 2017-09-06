// @flow

import React, {Component} from 'react';
import {injectIntl, intlShape} from 'react-intl';
import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Button from 'grommet/components/Button';
import Footer from 'grommet/components/Footer';
import CloseIcon from 'grommet/components/icons/base/Close';
import logo from '../logo.svg';
import SessionMenu from './SessionMenu';
import type {Business} from '../actions/businesses'

type Props = {
  toggleNav: () => void,
  business: Business,
  intl: intlShape,
};

class NavSidebar extends Component<Props> {
  render() {
    const {business, intl} = this.props;

    return (
      <Sidebar colorIndex="neutral-1" fixed={true}>
        <Header size="large" justify="between" pad={{horizontal: 'medium'}}>
          <Title a11yTitle="Close Menu">
            <img
              src={logo}
              className="App-logo"
              alt="logo"
              style={{height: '40px'}}
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
          <Anchor key="dashboard" path={`/${business.id}/dashboard`} label="Dashboard" />
          <Anchor key="calendar" path={`/${business.id}/calendar`} label="Calendar" />
          <Anchor
            key="clients"
            path={`/${business.id}/clients`}
            label={intl.formatMessage({
              id: 'clients.title',
              defaultMessage: 'Clients',
            })}
          />
          <Anchor key="jobs" path={`/${business.id}/jobs`} label="Jobs" />
        </Menu>
        <Footer pad={{horizontal: 'medium', vertical: 'small'}}>
          <SessionMenu
            dropAlign={{bottom: 'bottom'}}
            colorIndex="neutral-1-a"
          />
        </Footer>
      </Sidebar>
    );
  }
}

export default injectIntl(NavSidebar);
