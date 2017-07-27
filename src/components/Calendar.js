// @flow
import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import NavControl from "./NavControl";
import Box from "grommet/components/Box";

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

type Props = {
};

type State = {
};

class CalendarContainer extends Component<void, Props, State> {
  state: State = {
  };

  render() {

    return (
      <Box>
        <Header size="large" pad={{ horizontal: "medium" }}>
          <Title responsive={false}>
            <NavControl />
            <span>Calendar</span>
          </Title>
        </Header>
        <Box full={true} pad="medium">
          <BigCalendar
            events={[]}
            startAccessor='startDate'
            endAccessor='endDate'
          />
        </Box>
      </Box>
    );
  }

}

export default CalendarContainer;
