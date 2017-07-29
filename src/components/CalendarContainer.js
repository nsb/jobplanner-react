// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { Business } from "../actions/businesses";
import type { Visit } from "../actions/visits";
import { fetchVisits } from "../actions/visits";
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
    this.loadVisits()
  }

  render() {
    const { visits } = this.props;

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
            .format("YYYY-MM-DD"),
          ends__lte: moment(this.state.date)
            .endOf(this.state.view)
            .format("YYYY-MM-DD"),
          limit: 100,
          offset: 0
        })
      );
    }
  }
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
    business: entities.businesses[businessId],
    visits: visits.result.map((Id: number) => {
      return entities.visits[Id];
    }),
    token: auth.token
  };
};

export default connect(mapStateToProps)(CalendarContainer);
