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
  onEventDrop: Function
};

class Calendar extends Component<void, Props, void> {
  render() {
    const {
      visits,
      defaultView = "week",
      onNavigate,
      onView,
      onSelectSlot,
      onEventDrop
    } = this.props;
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
            selectable
            defaultView={defaultView}
            events={visits}
            titleAccessor="client"
            startAccessor={visit => {
              return new Date(visit.begins);
            }}
            endAccessor={visit => {
              return new Date(visit.ends);
            }}
            allDayAccessor={visit => {
              return !visit.time_begins;
            }}
            // view={view}
            onNavigate={onNavigate}
            onView={onView}
            onSelectSlot={onSelectSlot}
            onEventDrop={onEventDrop}
          />
        </Box>
      </Box>
    );
  }
}

export default DragDropContext(HTML5Backend)(Calendar);
