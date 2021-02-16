// @flow
import { IDENTITY_CONFIG, METADATA_OIDC } from "./authConst";
import { UserManager, WebStorageStateStore } from "oidc-client";
import posthog from "posthog-js";

export default class AuthService {
  UserManager: UserManager;

  constructor() {
    this.UserManager = new UserManager({
      ...IDENTITY_CONFIG,
      userStore: new WebStorageStateStore({ store: window.sessionStorage }),
      metadata: {
        ...METADATA_OIDC,
      },
    });
    this.UserManager.events.addUserLoaded((user) => {
      if (window.location.href.indexOf("signin-oidc") !== -1) {
        this.navigateToScreen();
      }
    });
    this.UserManager.events.addSilentRenewError((e) => {
      // console.log("silent renew error", e.message);
    });

    this.UserManager.events.addAccessTokenExpired(() => {
      // console.log("token expired");
      this.signinSilent();
    });
    this.UserManager.events.addUserSignedOut(() => {
      posthog.reset();
    });
  }

  signinRedirectCallback = () => {
    this.UserManager.signinRedirectCallback().then(() => {
      "";
    });
  };

  getUser = async () => {
    const user = await this.UserManager.getUser();
    if (!user) {
      return await this.UserManager.signinRedirectCallback();
    }
    return user;
  };

  parseJwt = (token: string) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  signinRedirect = () => {
    localStorage.setItem("redirectUri", window.location.pathname);
    this.UserManager.signinRedirect({});
  };

  navigateToScreen = () => {
    window.location.replace("/");
  };

  isAuthenticated = () => {
    if (!process.env.REACT_APP_AUTH_URL) {
      throw Error("REACT_APP_AUTH_URL is not set!");
    }

    if (!process.env.REACT_APP_IDENTITY_CLIENT_ID) {
      throw Error("REACT_APP_IDENTITY_CLIENT_ID is not set!");
    }

    const session = sessionStorage.getItem(
      `oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_IDENTITY_CLIENT_ID}`
    );
    let oidcStorage;
    if (session)
      oidcStorage = JSON.parse(session);

    return !!oidcStorage && !!oidcStorage.access_token;
  };

  signinSilent = () => {
    this.UserManager.signinSilent()
      .then((user) => {
        // console.log("signed in", user);
      })
      .catch((err) => {
        // console.log(err);
      });
  };
  signinSilentCallback = () => {
    this.UserManager.signinSilentCallback();
  };

  createSigninRequest = () => {
    return this.UserManager.createSigninRequest();
  };

  logout = () => {
    this.UserManager.signoutRedirect({
      id_token_hint: localStorage.getItem("id_token"),
    });
    this.UserManager.clearStaleState();
  };

  signoutRedirectCallback = () => {
    this.UserManager.signoutRedirectCallback().then(() => {
      localStorage.clear();
      window.location.replace(process.env.REACT_APP_PUBLIC_URL);
    });
    this.UserManager.clearStaleState();
  };
}
