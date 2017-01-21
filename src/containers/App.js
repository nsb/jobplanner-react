import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { App as AppGrommet, Split } from 'grommet'

// import logo from './logo.svg';
import './App.css';
import NavSidebar from '../components/NavSidebar'

class App extends Component {
  // static propTypes = {
  //   //  selectedReddit: PropTypes.string.isRequired,
  //   //  posts: PropTypes.array.isRequired,
  //   //  isFetching: PropTypes.bool.isRequired,
  //   //  lastUpdated: PropTypes.number,
  //   loginBusy: PropTypes.bool.isRequired,
  //   dispatch: PropTypes.func.isRequired
  // }

  static propTypes = {
    navEnabled: PropTypes.bool.isRequired
  }


  render() {
    console.log(this.props)
    const nav = <NavSidebar />
    const showNav = this.props.navEnabled

    return (
      <AppGrommet centered={false}>
        <Split priority={"left"} flex="right">
          {showNav ? nav : null}
          {this.props.children}
        </Split>
      </AppGrommet>
    );

    // <Login onSubmit={this.onSubmit} loginBusy={this.props.loginBusy}/>

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

}

const mapStateToProps = state => {
  const { login, nav } = state

  return {
    loginBusy: login.loginBusy,
    navEnabled: nav.enabled
  }
}

export default connect(mapStateToProps)(App)
// export default App
