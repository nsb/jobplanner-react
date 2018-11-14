// flow

export default class Auth {

  constructor(options) {
    this.login = this.login.bind(this);

    this.domain = options.domain;
    this.clientID = options.clientID;
    this.redirectUri = options.redirectUri;
    this.scope = options.scope;
  }
    
  login() {
    let params: URLSearchParams = new URLSearchParams({
      client_id: this.clientID,
      response_type: 'code',
      scope: this.scope,
      redirect_uri: this.redirectUri
    });
    const authUrl = `${this.domain}?${params.toString()}`
    window.location.href = authUrl;
  }
}
