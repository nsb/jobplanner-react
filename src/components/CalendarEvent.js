import React, { Component } from "react";
import type { Visit } from "../actions/visits";

type Props = {
  event: Visit,
  title: string
};

class CalendarEvent extends Component<Props> {
  render() {
    const { event, title } = this.props;

    return (
      <div>
        {title}
      </div>
    );
  }
}

export default CalendarEvent;
