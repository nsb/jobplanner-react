import React, { PropTypes, Component } from 'react'
// import { connect } from 'react-redux'
import { LoginForm, Split, Sidebar, Footer } from 'grommet'

class Login extends Component {
  static propTypes = {
    loginBusy: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  render() {
      return <Split flex="left">
          <div>Davs</div>
          <Sidebar justify="between" align="center" pad="none" size="large">
              <span />
              <LoginForm align="start"
                  title="jobPlanner"
                  onSubmit={this.props.loginBusy ? null : this.props.onSubmit}
                  usernameType="text" />
              <Footer direction="row" size="small"
                  pad={{ horizontal: "medium", vertical: "small", between: "small" }}>
                  <span className="secondary">&copy; 2016 jobPlanner</span>
              </Footer>
          </Sidebar>
      </Split>
  }
    // return (
    //   <div className="App">
    //     <div className="App-header">
    //       <img src={logo} className="App-logo" alt="logo" />
    //       <h2>Welcome to React</h2>
    //     </div>
    //     <p className="App-intro">
    //       To get started, edit <code>src/App.js</code> and save to reload.
    //     </p>
    //   </div>
    // );
}


export default Login
