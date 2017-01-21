import React, { Component } from 'react';
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

  render() {
    const nav = <NavSidebar />
    const showNav = true

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

// const mapStateToProps = state => {
//   const { login } = state
//
//   return {
//     loginBusy: login.loginBusy
//   }
// }
//
// export default connect(mapStateToProps)(App)
export default App
