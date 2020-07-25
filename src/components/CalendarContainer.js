// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl, FormattedMessage, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import moment from "moment";
import { ensureState } from "redux-optimistic-ui";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { Business } from "../actions/businesses";
import type { Visit } from "../actions/visits";
import type { Responsive } from "../actions/nav";
import { fetchVisits, updateVisit } from "../actions/visits";
import VisitLayerContainer from "./VisitLayerContainer";
import { getVisitsGroupedByDay } from "../selectors/visitSelectors";
import Calendar from "./Calendar";
import JobClose from "./JobClose";
import { AuthContext } from "../providers/authProvider";
import { Can } from "./Can";
import type { Element } from "react";

const intlVisitCount = (count: number) => (
  <FormattedMessage
    id="calendar.visitCount"
    description="Calendar visit count"
    defaultMessage={`{count, number} {count, plural, one {visit} other {visits}}`}
    values={{ count }}
  />
);

type Props = {
  business: Business,
  visits: Array<
    | Visit
    | {
        begins: string,
        ends: string,
        anytime: boolean,
        title: string | Element<*>,
      }
  >,
  getJobById: Function,
  dispatch: Dispatch,
  responsive: Responsive,
  jobsIsFetching: boolean,
};

type CalendarView = "day" | "week" | "month";

type State = {
  views: Array<CalendarView>,
  view: CalendarView,
  date: Date,
  selected: ?Visit,
  showJobClose: number,
};

class CalendarContainer extends Component<Props & { intl: intlShape }, State> {
  // state: State = { view: "week", date: new Date(), selected: undefined, showJobClose: 0 };
  static contextType = AuthContext;

  constructor({ responsive }: Props) {
    super();
    this.state = {
      views: responsive === "single" ? ["day"] : ["month", "week", "day"],
      view: responsive === "single" ? "day" : "week",
      date: new Date(),
      selected: undefined,
      showJobClose: 0,
    };
  }

  componentDidMount() {
    this.loadVisits(
      moment(this.state.date).startOf(this.state.view).toDate(),
      moment(this.state.date).add(1, "years").toDate()
    );
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { getJobById } = this.props;

    if (prevState.selected && !this.state.selected) {
      let job = getJobById(prevState.selected.job);

      if (job && !job.closed && job.incomplete_visit_count === 0) {
        // ask to close job if it has no upcoming visits
        this.setState({ showJobClose: job.id });
      }
    }
  }

  render() {
    const { visits, getJobById, responsive, jobsIsFetching } = this.props;

    let visitLayer;
    if (this.state.selected) {
      visitLayer = (
        <VisitLayerContainer
          visit={this.state.selected}
          onClose={this.onClose}
        />
      );
    }

    let jobCloseLayer;
    if (this.state.showJobClose) {
      jobCloseLayer = (
        <JobClose
          job={getJobById(this.state.showJobClose)}
          onClose={() => {
            this.setState({ showJobClose: 0 });
          }}
          isFetching={jobsIsFetching}
        />
      );
    }

    const calendar = (
      <Can I="update" a="Visit" passThrough>
        {(allowed) => (
          <Calendar
            visits={visits}
            views={this.state.views}
            defaultView={this.state.view}
            defaultDate={this.state.date}
            onNavigate={(date: Date) => {
              this.setState({ date }, this.loadVisits);
            }}
            onView={(view: CalendarView) => {
              this.setState({ view }, this.loadVisits);
            }}
            onSelectSlot={(e: Event) => {}}
            onSelectEvent={this.onClick}
            onEventDrop={allowed ? this.onEventDrop : undefined}
            responsive={responsive}
          />
        )}
      </Can>
    );

    return (
      <div>
        {calendar}
        {visitLayer}
        {jobCloseLayer}
      </div>
    );
  }

  onEventDrop = ({
    event,
    start,
    end,
    isAllDay = false,
  }: {
    event: Visit,
    start: Date,
    end: Date,
    isAllDay: boolean,
  }) => {
    const { dispatch, intl } = this.props;

    const anytime = isAllDay;

    const { getUser } = this.context;
    getUser()
      .then(({ access_token }) => {
        return dispatch(
          updateVisit(
            { id: event.id, begins: start, ends: end, anytime: anytime },
            access_token,
            true,
            true
          )
        );
      })
      .then(() => {
        addSuccess({ text: intl.formatMessage({ id: "flash.saved" }) });
      })
      .catch(() => {
        addError({ text: intl.formatMessage({ id: "flash.error" }) });
      });
  };

  onClick = (visit: Visit) => {
    this.setState({ selected: visit });
  };

  onClose = () => {
    this.setState({ selected: undefined });
  };

  loadVisits = (begins = null, ends = null) => {
    const { business, dispatch, intl } = this.props;
    const { getUser } = this.context;
    getUser()
      .then(({ access_token }) => {
        return dispatch(
          fetchVisits(access_token, {
            business: business.id,
            ordering: "begins",
            begins__gte:
              begins ||
              moment(this.state.date).startOf(this.state.view).toDate(),
            ends__lte:
              ends || moment(this.state.date).endOf(this.state.view).toDate(),
            limit: 200,
            offset: 0,
          })
        );
      })
      .catch(() => {
        addError({ text: intl.formatMessage({ id: "flash.error" }) });
      });
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number } },
    history: { push: Function },
    dispatch: Dispatch,
    responsive: Responsive,
  }
): Props => {
  const { entities, nav, jobs } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  const visits = Object.entries(getVisitsGroupedByDay(state))
    .map(([date: string, visits: Array<Visit>]) => {
      return [
        {
          begins: date,
          ends: date,
          anytime: true,
          // $FlowFixMe https://github.com/facebook/flow/issues/5838
          title: intlVisitCount(visits.length),
        },
        // $FlowFixMe https://github.com/facebook/flow/issues/5838
        ...visits,
      ];
    })
    .flatMap((arr) => arr);

  return {
    business: ensureState(entities).businesses[businessId],
    visits: visits,
    dispatch: ownProps.dispatch,
    responsive: nav.responsive,
    getJobById: (id) => ensureState(entities).jobs[id],
    jobsIsFetching: jobs.isFetching,
  };
};

export default connect(mapStateToProps)(injectIntl(CalendarContainer));
