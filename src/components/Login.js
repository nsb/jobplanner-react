import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import LoginForm from 'grommet/components/LoginForm';
import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import Footer from 'grommet/components/Footer';
import logo from '../logo.svg';
import {login} from '../actions/auth';

class Login extends Component {
  static propTypes = {
    loginBusy: PropTypes.bool.isRequired,
  };

  onSubmit = credentials => {
    this.props.dispatch(login(credentials));
  };

  render() {
    return (
      <Split flex="left">
        <div>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <Sidebar justify="between" align="center" pad="none" size="large">
          <span />
          <LoginForm
            align="start"
            title="jobPlanner"
            onSubmit={this.props.loginBusy ? null : this.onSubmit}
            usernameType="text"
          />
          <Footer
            direction="row"
            size="small"
            pad={{horizontal: 'medium', vertical: 'small', between: 'small'}}
          >
            <span className="secondary">© 2017 jobPlanner</span>
          </Footer>
        </Sidebar>
      </Split>
    );
  }
}

const mapStateToProps = state => {
  const {auth} = state;

  return {
    loginBusy: auth.busy,
  };
};

export default connect(mapStateToProps)(Login);
