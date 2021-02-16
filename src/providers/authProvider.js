// @flow

import React, { Component } from "react";
import AuthService from "../auth/authService";

type t = {
  signinRedirectCallback: () => void,
  logout: () => void,
  signoutRedirectCallback: () => void,
  isAuthenticated: () => boolean,
  signinRedirect: () => void,
  signinSilentCallback: () => void,
  createSigninRequest: () => ({}),
  getUser: () => Promise<{ access_token: string }>
}

const authService = new AuthService()

export const AuthContext = React.createContext < t > (authService);

export const AuthConsumer = AuthContext.Consumer;

type Props = {
  children: any
};

export class AuthProvider extends Component<Props> {
  render() {
    return (
      <AuthContext.Provider value={authService}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
