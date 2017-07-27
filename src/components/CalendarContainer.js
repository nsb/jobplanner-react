// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {State as ReduxState} from '../types/State';
import type {Dispatch} from '../types/Store';

import Calendar from "./Calendar";

type Props = {
};

type State = {
  view: "day" | "week" | "month" | "agenda",
  date: Date
};

class CalendarContainer extends Component {
  state: {
    view: "day" | "week" | "month" | "agenda",
    date: Date
  } = { view: "week", date: new Date() }

  render() {
    const { visits } = this.props;

    return (
      <Calendar
        visits={visits}
        view={this.state.view}
        date={this.state.date}
        onNavigate={e => {
          console.log(e, "onNavigate");
        }}
        onView={e => {
          console.log(e, "onView");
        }}
        onSelectSlot={e => {
          console.log(e, "onSelectSlot");
        }}
      />
    );
  }

}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    history: {push: Function},
    dispatch: Dispatch,
  }
): Props => {
  const { visits, entities } = state;

  return {
    visits: visits.result.map((Id: number) => {
      return entities.visits[Id];
    }),
  };
};

export default connect(mapStateToProps)(CalendarContainer);
