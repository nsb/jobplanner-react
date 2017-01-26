import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Button from 'grommet/components/Button'
import { navToggle } from '../actions'
import logo from '../logo.svg'

class NavControl extends Component {
  render () {
    const { nav: { active }, dispatch } = this.props

    let result;
    if (! active) {
      result = (
        <Button onClick={() => dispatch(navToggle()) }>
          <img src={logo} className="App-logo" alt="logo" style={{height : '40px'}} />
        </Button>
      );
    } else {
      result = null;
    }
    return result;
  }
};

NavControl.propTypes = {
  nav: PropTypes.object,
};

let select = (state, props) => ({
  nav: state.nav
});

export default connect(select)(NavControl);
