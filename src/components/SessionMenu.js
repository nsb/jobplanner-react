// @flow
import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import Menu from "grommet/components/Menu";
import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import UserIcon from "grommet/components/icons/base/User";
import history from "../history";
import type { User } from "../actions/users";

const intlSession = (
  <FormattedMessage
    id="session.title"
    description="Session label"
    defaultMessage="Session"
  />
)

const intlLogout = (
  <FormattedMessage
    id="session.logout"
    description="Logout label"
    defaultMessage="Logout"
  />
)

type Props = {
  user: User,
  dropAlign: Object,
  colorIndex: string,
  logout: Function
};

class SessionMenu extends Component<Props> {
  render() {
    const { user, dropAlign, colorIndex } = this.props;

    return (
      <Menu
        icon={<UserIcon />}
        dropAlign={dropAlign}
        colorIndex={colorIndex}
        a11yTitle={intlSession}
      >
        <Box pad="medium">
          <Heading tag="h3" margin="none">
            {user.username}
          </Heading>
        </Box>
        <Anchor href="#" onClick={this.onLogout} label={intlLogout} />
      </Menu>
    );
  }

  onLogout = (e: SyntheticEvent<>) => {
    this.props.logout();
    history.push("/login");
    e.preventDefault();
  };
}

export default injectIntl(SessionMenu);
