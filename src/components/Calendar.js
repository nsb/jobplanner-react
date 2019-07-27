// @flow
import React, { Component } from "react";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import { Calendar } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import localizer from 'react-big-calendar/lib/localizers/moment'
import moment from "moment";
import Box from "grommet/components/Box";
import NavControl from "./NavControl";
import CalendarEvent from "./CalendarEvent";
import CalendarEventAgenda from "./CalendarEventAgenda";
import type { Visit } from "../actions/visits";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const momentLocalizer = localizer(moment);

const title = (
  <FormattedMessage
    id="calendar.title"
    description="Calendar title"
    defaultMessage="Calendar"
  />
)

const intlPrevious = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.previousLabel"
    description="Calendar previous label"
    defaultMessage="previous"
  />
)

const intlToday = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.todayLabel"
    description="Calendar today label"
    defaultMessage="today"
  />
)

const intlNext = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.nextLabel"
    description="Calendar next label"
    defaultMessage="next"
  />
)

const intlMonth = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.monthLabel"
    description="Calendar month label"
    defaultMessage="month"
  />
)

const intlWeek = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.weekLabel"
    description="Calendar week label"
    defaultMessage="week"
  />
)

const intlDay = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.dayLabel"
    description="Calendar day label"
    defaultMessage="day"
  />
)

const intlAgenda = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="calendar.agendaLabel"
    description="Calendar agenda label"
    defaultMessage="agenda"
  />
)

type Props = {
  visits: Array<Visit>,
  // visitsGroupedByDay: { [key: string]: Array<Visit> },
  defaultView: "day" | "week" | "month" | "agenda",
  defaultDate: Date,
  onNavigate: Function,
  onView: Function,
  onSelectSlot: Function,
  onSelectEvent: Function,
  onEventDrop: Function
};

class DnDCalendar extends Component<Props & { intl: intlShape }> {
  render() {
    const {
      visits,
      defaultView = "week",
      onNavigate,
      onView,
      onSelectSlot,
      onSelectEvent,
      onEventDrop,
      intl
    } = this.props;

    let scrollToTime = new Date();
    scrollToTime.setHours(6);

    const messages = {
      next: intl.formatMessage({id: "calendar.nextLabel"}),
      previous: intl.formatMessage({id: "calendar.previousLabel"}),
      today: intl.formatMessage({id: "calendar.todayLabel"}),
      month: intl.formatMessage({id: "calendar.monthLabel"}),
      week: intl.formatMessage({id: "calendar.weekLabel"}),
      day: intl.formatMessage({id: "calendar.dayLabel"}),
      agenda: intl.formatMessage({id: "calendar.agendaLabel"})
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
            defaultView={defaultView}
            events={visits}
            titleAccessor={visit => visit.title || visit.client_name}
            startAccessor={visit => {
              return new Date(visit.begins);
            }}
            endAccessor={visit => {
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
              agenda: {
                event: CalendarEventAgenda
              }
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
                        "background-color": "#bbb",
                        "text-decoration": "line-through"
                      }
                    : {
                        "background-color": "#0A64A0"
                      }
                }
              } else {
                  return {
                    className: "jobplanner__counter",
                    style: {
                      "background-color": "#fff",
                      "color": "#333"
                    }
                  }
                }
              }
            }
          />
        </Box>
      </Box>
    );
  }
}

export default injectIntl(DnDCalendar);
