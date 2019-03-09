// @flow
import React, { Component } from "react";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import Box from "grommet/components/Box";
import NavControl from "./NavControl";
import CalendarEvent from "./CalendarEvent";
import CalendarEventAgenda from "./CalendarEventAgenda";
import type { Visit } from "../actions/visits";

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const title = (
  <FormattedMessage
    id="calendar.title"
    description="Calendar title"
    defaultMessage="Calendar"
  />
)

type Props = {
  visits: Array<Visit>,
  defaultView: "day" | "week" | "month" | "agenda",
  defaultDate: Date,
  onNavigate: Function,
  onView: Function,
  onSelectSlot: Function,
  onSelectEvent: Function,
  onEventDrop: Function,
  intl: intlShape
};

class Calendar extends Component<Props> {
  render() {
    const {
      visits,
      defaultView = "week",
      onNavigate,
      onView,
      onSelectSlot,
      onSelectEvent,
      onEventDrop
    } = this.props;

    let scrollToTime = new Date();
    scrollToTime.setHours(6);

    return (
      <Box>
        <NavControl title={title} />
        <Box full={true} pad="medium">
          <DragAndDropCalendar
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
                      "background-color": "#0096D6"
                    }
              };
            }}
          />
        </Box>
      </Box>
    );
  }
}

export default DragDropContext(HTML5Backend)(injectIntl(Calendar));
