import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { LoginForm, Split, Sidebar, Footer } from 'grommet'
import logo from '../logo.svg'
import { login } from '../actions/login'

class Login extends Component {
  static propTypes = {
    loginBusy: PropTypes.bool.isRequired,
  }

  onSubmit = (credentials) => {
    this.props.dispatch(login(credentials))
  }

  render() {
      return <Split flex="left">
          <div>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <Sidebar justify="between" align="center" pad="none" size="large">
              <span />
              <LoginForm align="start"
                  title="jobPlanner"
                  onSubmit={this.props.loginBusy ? null : this.onSubmit}
                  usernameType="text" />
              <Footer direction="row" size="small"
                  pad={{ horizontal: "medium", vertical: "small", between: "small" }}>
                  <span className="secondary">&copy; 2016 jobPlanner</span>
              </Footer>
          </Sidebar>
      </Split>
  }
}


const mapStateToProps = state => {
  const { login } = state

  return {
    loginBusy: login.busy
  }
}

export default connect(mapStateToProps)(Login)
