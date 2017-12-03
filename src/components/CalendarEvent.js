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
        {title} {event.completed ? "Completed" : "Not completed"}
      </div>
    );
  }
}

export default CalendarEvent;
