// @flow
import React from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import { Calendar } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import localizer from "react-big-calendar/lib/localizers/moment";
import moment from "moment";
import Box from "grommet/components/Box";
import NavControl from "./NavControl";
import CalendarEvent from "./CalendarEvent";
import type { Visit } from "../actions/visits";
import type { Responsive } from "../actions/nav";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const momentLocalizer = localizer(moment);

const title = (
  <FormattedMessage
    id="calendar.title"
    description="Calendar title"
    defaultMessage="Calendar"
  />
);

const intlPrevious = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.previousLabel"
    description="Calendar previous label"
    defaultMessage="previous"
  />
);

const intlToday = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.todayLabel"
    description="Calendar today label"
    defaultMessage="today"
  />
);

const intlNext = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.nextLabel"
    description="Calendar next label"
    defaultMessage="next"
  />
);

const intlMonth = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.monthLabel"
    description="Calendar month label"
    defaultMessage="month"
  />
);

const intlWeek = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.weekLabel"
    description="Calendar week label"
    defaultMessage="week"
  />
);

const intlDay = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.dayLabel"
    description="Calendar day label"
    defaultMessage="day"
  />
);

type Props = {
  visits: Array<Visit>,
  // visitsGroupedByDay: { [key: string]: Array<Visit> },
  views: Array<"day" | "week" | "month">,
  defaultView: "day" | "week" | "month",
  defaultDate: Date,
  responsive: Responsive,
  onNavigate: Function,
  onView: Function,
  onSelectSlot: Function,
  onSelectEvent: Function,
  onEventDrop: Function,
};

const DnDCalendar = ({
  visits,
  views = ["month", "week", "day"],
  defaultView = "week",
  onNavigate,
  onView,
  onSelectSlot,
  onSelectEvent,
  onEventDrop,
  intl,
  responsive,
}: Props & { intl: intlShape }) => {
  let scrollToTime = new Date();
  scrollToTime.setHours(6);

  const messages = {
    next: intl.formatMessage({ id: "calendar.nextLabel" }),
    previous: intl.formatMessage({ id: "calendar.previousLabel" }),
    today: intl.formatMessage({ id: "calendar.todayLabel" }),
    month: intl.formatMessage({ id: "calendar.monthLabel" }),
    week: intl.formatMessage({ id: "calendar.weekLabel" }),
    day: intl.formatMessage({ id: "calendar.dayLabel" }),
  };

  return (
    <Box>
      <NavControl title={title} />
      <Box full={true} pad="medium">
        <DragAndDropCalendar
          messages={messages}
          localizer={momentLocalizer}
          selectable={true}
          popup={true}
          views={views}
          defaultView={defaultView}
          events={visits}
          titleAccessor={(visit) => visit.title || visit.client_name}
          startAccessor={(visit) => {
            return new Date(visit.begins);
          }}
          endAccessor={(visit) => {
            return new Date(visit.ends);
          }}
          allDayAccessor="anytime"
          scrollToTime={scrollToTime}
          onNavigate={onNavigate}
          onView={onView}
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
          onEventDrop={onEventDrop}
          components={{
            event: CalendarEvent,
          }}
          eventPropGetter={(
            event: Visit,
            start: Date,
            end: Date,
            selected: boolean
          ) => {
            if (event.id) {
              return {
                className: event.completed
                  ? "jobplanner__completed"
                  : "jobplanner__incomplete",
                style: event.completed
                  ? {
                      "background-color": "#a8a8a8",
                      "text-decoration": "line-through",
                    }
                  : {
                      background: "#49516f",
                      opacity: 0.8,
                    },
              };
            } else {
              return {
                className: "jobplanner__counter",
                style: {
                  "background-color": "#fff",
                  color: "#434343",
                  "font-weight": "bold",
                },
              };
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default injectIntl(DnDCalendar);
