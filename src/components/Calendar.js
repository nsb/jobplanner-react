// @flow
import React, { Component } from "react";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import NavControl from "./NavControl";
import Box from "grommet/components/Box";
import type { Visit } from "../actions/visits";

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

type Props = {
  visits: Array<Visit>,
  defaultView: "day" | "week" | "month" | "agenda",
  defaultDate: Date,
  onNavigate: Function,
  onView: Function,
  onSelectSlot: Function,
  onSelectEvent: Function,
  onEventDrop: Function
};

class Calendar extends Component<Props, void> {
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
        <Header size="large" pad={{ horizontal: "medium" }}>
          <Title responsive={false}>
            <NavControl />
            <span>Calendar</span>
          </Title>
        </Header>
        <Box full={true} pad="medium">
          <DragAndDropCalendar
            selectable={true}
            popup={true}
            defaultView={defaultView}
            events={visits}
            titleAccessor="client_name"
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
          />
        </Box>
      </Box>
    );
  }
}

export default DragDropContext(HTML5Backend)(Calendar);
