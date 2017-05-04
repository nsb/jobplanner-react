// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Switch, Route} from 'react-router-dom';
import {push} from 'react-router-redux';
import AppGrommet from 'grommet/components/App';
import AppAuthenticated from '../containers/AppAuthenticated';
import Login from '../components/Login';

import './App.css';

// type Props = {
//   children: [Component<void, Props, void>],
// };

// const authRequired = (nextState: State) => {
//   if (!store.getState().auth.token) {
//     store.dispatch(push('/login'));
//   }
// };

class App extends Component {
  // componentWillMount() {
  //   this.props.dispatch(push('/login'));
  // }

  render() {
    return (
      <AppGrommet centered={false}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route component={AppAuthenticated} />
        </Switch>
      </AppGrommet>
    );
  }
}

export default connect()(App);
