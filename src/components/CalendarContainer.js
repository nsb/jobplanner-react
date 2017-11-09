// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ensureState } from "redux-optimistic-ui";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { Business } from "../actions/businesses";
import type { Visit } from "../actions/visits";
import type { Responsive } from "../actions/nav";
import { fetchVisits, updateVisit } from "../actions/visits";
import VisitDetailContainer from "./VisitLayerContainer";
import Calendar from "./Calendar";
import CalendarList from "./CalendarList";

type Props = {
  business: Business,
  visits: Array<Visit>,
  token: string,
  dispatch: Dispatch,
  responsive: Responsive
};

type CalendarView = "day" | "week" | "month" | "agenda";

type State = {
  view: CalendarView,
  date: Date,
  selected?: Visit
};

class CalendarContainer extends Component<Props, State> {
  state: State = { view: "week", date: new Date() };

  componentDidMount() {
    this.loadVisits(
      moment(this.state.date).startOf(this.state.view).toDate(),
      moment(this.state.date).add(1, "years").toDate()
    );
  }

  render() {
    const { business, visits, responsive } = this.props;

    let visitLayer;
    if (this.state.selected) {
      visitLayer = (
        <VisitDetailContainer
          visit={this.state.selected}
          onClose={this.onClose}
        />
      );
    }

    const calendar = responsive === "multiple"
      ? <Calendar
          visits={visits}
          defaultView={this.state.view}
          defaultDate={this.state.date}
          onNavigate={(date: Date) => {
            this.setState({ date }, this.loadVisits);
          }}
          onView={(view: CalendarView) => {
            this.setState({ view }, this.loadVisits);
          }}
          onSelectSlot={(e: Event) => {
            console.log(e, "onSelectSlot");
          }}
          onSelectEvent={this.onClick}
          onEventDrop={this.onEventDrop}
        />
      : <CalendarList visits={visits} business={business} />;

    return (
      <div>
        {calendar}
        {visitLayer}
      </div>
    );
  }

  onEventDrop = ({
    event,
    start,
    end
  }: {
    event: Visit,
    start: Date,
    end: Date
  }) => {
    const { dispatch, token } = this.props;
    const origBegins: Date = new Date(event.begins);

    const timeChanged = !(
      `${origBegins.getHours()}:${origBegins.getMinutes()}` ===
      `${start.getHours()}:${start.getMinutes()}`
    );

    const dateChanged = !(
      `${origBegins.getDate()}-${origBegins.getMonth()}-${origBegins.getFullYear()}` ===
      `${start.getDate()}-${start.getMonth()}-${start.getFullYear()}`
    );

    const anytime =
      !!(!timeChanged && event.anytime) || (!timeChanged && !dateChanged);

    dispatch(
      updateVisit(
        { id: event.id, begins: start, ends: end, anytime: anytime },
        token,
        true,
        true
      )
    );
  };

  onClick = (visit: Visit) => {
    this.setState({ selected: visit });
  };

  onClose = () => {
    this.setState({ selected: undefined });
  };

  loadVisits = (begins = null, ends = null) => {
    const { business, token, dispatch } = this.props;
    if (token) {
      dispatch(
        fetchVisits(token, {
          business: business.id,
          ordering: "begins",
          begins__gte: ((begins && moment(begins)) ||
            moment(this.state.date).startOf(this.state.view))
            .format("YYYY-MM-DDT00:00"),
          ends__lte: ((ends && moment(ends)) ||
            moment(this.state.date).endOf(this.state.view))
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
  const { visits, entities, auth, nav } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: ensureState(entities).businesses[businessId],
    visits: ensureState(visits).result.map((Id: number) => {
      return ensureState(entities).visits[Id];
    }),
    token: auth.token,
    dispatch: ownProps.dispatch,
    responsive: nav.responsive
  };
};

export default connect(mapStateToProps)(CalendarContainer);
