// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { Visit } from "../actions/visits";
import { fetchVisits } from "../actions/visits";
import Calendar from "./Calendar";

type Props = {
  visits: Array<Visit>
};

class CalendarContainer extends Component {
  state: {
    view: "day" | "week" | "month" | "agenda",
    date: Date
  } = { view: "week", date: new Date() };

  componentDidMount() {
    const { token, dispatch } = this.props;
    if (token) {
      dispatch(
        fetchVisits(token, {
          ordering: "begins",
          // begins__gt: moment().format("YYYY-MM-DD"),
          limit: 100,
          offset: 0
        })
      );
    }
  };

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
    history: { push: Function },
    dispatch: Dispatch
  }
): Props => {
  const { visits, entities, auth } = state;

  return {
    visits: visits.result.map((Id: number) => {
      return entities.visits[Id];
    }),
    token: auth.token
  };
};

export default connect(mapStateToProps)(CalendarContainer);
