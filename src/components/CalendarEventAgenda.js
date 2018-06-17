import React, { Component } from "react";
import type { Visit } from "../actions/visits";

type Props = {
  event: Visit,
  title: string
};

class CalendarEventAgenda extends Component<Props> {
  render() {
    const { title, event } = this.props;

    return (
      <div>
        {title} - {event.details}
      </div>
    );
  }
}

export default CalendarEventAgenda;
