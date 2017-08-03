// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ensureState } from "redux-optimistic-ui";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { Business } from "../actions/businesses";
import type { Visit } from "../actions/visits";
import { fetchVisits, updateVisit } from "../actions/visits";
import Calendar from "./Calendar";

type Props = {
  business: Business,
  visits: Array<Visit>,
  token: ?string
};

class CalendarContainer extends Component {
  state: {
    view: "day" | "week" | "month" | "agenda",
    date: Date
  } = { view: "week", date: new Date() };

  componentDidMount() {
    this.loadVisits();
  }

  render() {
    const { visits, dispatch, token } = this.props;

    return (
      <Calendar
        visits={visits}
        defaultView={this.state.view}
        defaultDate={this.state.date}
        onNavigate={date => {
          this.setState({ date }, this.loadVisits);
        }}
        onView={view => {
          this.setState({ view }, this.loadVisits);
        }}
        onSelectSlot={e => {
          console.log(e, "onSelectSlot");
        }}
        onEventDrop={({ event, start, end }) => {
          dispatch(
            updateVisit({ ...event, begins: start, ends: end }, token, true)
          );
        }}
      />
    );
  }

  loadVisits = () => {
    const { business, token, dispatch } = this.props;
    if (token) {
      dispatch(
        fetchVisits(token, {
          business: business.id,
          ordering: "begins",
          begins__gte: moment(this.state.date)
            .startOf(this.state.view)
            .format("YYYY-MM-DDT00:00"),
          ends__lte: moment(this.state.date)
            .endOf(this.state.view)
            .format("YYYY-MM-DDT00:00"),
          limit: 100,
          offset: 0
        })
      );
    }
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number } },
    history: { push: Function },
    dispatch: Dispatch
  }
): Props => {
  const { visits, entities, auth } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: ensureState(entities).businesses[businessId],
    visits: ensureState(visits).result.map((Id: number) => {
      return ensureState(entities).visits[Id];
    }),
    token: auth.token
  };
};

export default connect(mapStateToProps)(CalendarContainer);
