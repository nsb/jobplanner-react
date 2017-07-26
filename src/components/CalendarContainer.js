// @flow
import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

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
      <BigCalendar
        events={[]}
        startAccessor='startDate'
        endAccessor='endDate'
      />
    );
  }

}

export default CalendarContainer;
