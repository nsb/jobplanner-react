// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import Menu from "grommet/components/Menu";
import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import UserIcon from "grommet/components/icons/base/User";
import { logout } from "../actions/auth";
import history from "../history";
import type { User } from "../actions/users";
import type { Dispatch } from "../types/Store";
import type { State } from "../types/State";

type Props = {
  user: User,
  dropAlign: Object,
  colorIndex: string,
  dispatch: Dispatch
};

class SessionMenu extends Component<Props> {
  render() {
    const { user, dropAlign, colorIndex } = this.props;

    return (
      <Menu
        icon={<UserIcon />}
        dropAlign={dropAlign}
        colorIndex={colorIndex}
        a11yTitle="Session"
      >
        <Box pad="medium">
          <Heading tag="h3" margin="none">
            {user.username}
          </Heading>
        </Box>
        <Anchor href="#" onClick={this.onLogout} label="Logout" />
      </Menu>
    );
  }

  onLogout = e => {
    this.props.dispatch(logout());
    history.push("/login");
    e.preventDefault();
  };
}

const mapStateToProps = (state: State): * => {
  const { users } = state;

  return {
    user: users.me
  };
};

export default connect(mapStateToProps)(SessionMenu);
