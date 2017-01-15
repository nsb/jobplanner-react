import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { login } from '../actions'

// import logo from './logo.svg';
import './App.css';
import Login from '../components/Login';

class App extends Component {
  static propTypes = {
    //  selectedReddit: PropTypes.string.isRequired,
    //  posts: PropTypes.array.isRequired,
    //  isFetching: PropTypes.bool.isRequired,
    //  lastUpdated: PropTypes.number,
    loginBusy: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render() {

    return (
      <Login onSubmit={this.onSubmit} loginBusy={this.props.loginBusy}/>
    );
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

  onSubmit = (credentials) => {
    this.props.dispatch(login(credentials))
  }
}

const mapStateToProps = state => {
  const { login } = state

  return {
    loginBusy: login.loginBusy
  }
}

export default connect(mapStateToProps)(App)
