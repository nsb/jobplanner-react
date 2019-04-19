import React, { Component } from "react";
import Tag from "./Tag";
import type { VisitStatus } from "../actions/visits";

type Props = {
    status: VisitStatus
}

class VisitStatusTag extends Component<Props> {
    render () {
        const { status } = this.props;
        switch(status) {
            case 'completed': return <Tag text="Completed" color="accent-1" />;
            case 'upcoming': return <Tag text="Upcoming" color="accent-2" />;
            case 'overdue': return <Tag text="Overdue" color="accent-3" />;
            default: return null
          }
    }
}

export default VisitStatusTag