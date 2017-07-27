// @flow
import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
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
      <Box full={true} pad="medium">
        <BigCalendar
          events={[]}
          startAccessor='startDate'
          endAccessor='endDate'
        />
      </Box>
    );
  }

}

export default CalendarContainer;
