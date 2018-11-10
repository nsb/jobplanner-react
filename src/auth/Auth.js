// flow

import history from "../history";

export default class Auth {

  constructor(options) {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);

    this.domain = options.domain;
    this.clientID = options.clientID;
    this.redirectUri = options.redirectUri;
    this.scope = options.scope;
  }
    
  login() {
    // https://accounts.google.com/o/oauth2/v2/auth?client_id=476296280704-c2mm4ah5k3guj1bl8arlmuh4561l28mv.apps.googleusercontent.com&response_type=code&scope=email&redirect_uri=http://localhost&access_type=offline

    let params: URLSearchParams = new URLSearchParams({
      client_id: this.clientID,
      response_type: 'code',
      scope: this.scope,
      redirect_uri: this.redirectUri
    });
    const authUrl = `${this.domain}?${params.toString()}`
    window.location.href = authUrl;
  }

  handleAuthentication() {
    // this.auth0.parseHash((err, authResult) => {
    //   if (authResult && authResult.accessToken && authResult.idToken) {
    //     this.setSession(authResult);
    //     history.replace("/");
    //   } else if (err) {
    //     history.replace("/");
    //     console.log(err);
    //   }
    // });
  }

  setSession(authResult) {
    // Set the time that the Access Token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem("token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
    // navigate to the home route
    history.replace("/");
  }

  logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    // navigate to the home route
    history.replace("/");
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }
}
