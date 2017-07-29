// @flow
import React from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import NavControl from "./NavControl";
import Box from "grommet/components/Box";
import type { Visit } from "../actions/visits";

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

type Props = {
  visits: Array<Visit>,
  view: "day" | "week" | "month" | "agenda",
  date: Date,
  onNavigate: Function,
  onView: Function,
  onSelectSlot: Function
};

const Calendar = ({
  visits = [],
  view = "week",
  onNavigate,
  onView,
  onSelectSlot
}: Props) =>
  <Box>
    <Header size="large" pad={{ horizontal: "medium" }}>
      <Title responsive={false}>
        <NavControl />
        <span>Calendar</span>
      </Title>
    </Header>
    <Box full={true} pad="medium">
      <BigCalendar
        defaultView="week"
        events={visits}
        titleAccessor="client"
        startAccessor={visit => {
          return new Date(visit.begins);
        }}
        endAccessor={visit => {
          return new Date(visit.ends);
        }}
        allDayAccessor={visit => {
          return !visit.time_begins
        }}
        // view={view}
        onNavigate={onNavigate}
        onView={onView}
        onSelectSlot={onSelectSlot}
      />
    </Box>
  </Box>;

export default Calendar;
