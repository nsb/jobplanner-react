// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {Dispatch} from '../types/Store';
import type {State as ReduxState} from '../types/State';

import Calendar from "./Calendar";

type Props = {
};

class CalendarContainer extends Component {

  render() {

    return (
      <Calendar/>
    );
  }

}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
  }
): Props => {

  return {
  };
};

export default connect(mapStateToProps)(CalendarContainer);
