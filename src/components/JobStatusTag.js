import React, { Component } from "react";
import Tag from "./Tag";
import type { JobStatus } from "../actions/jobs";

type Props = {
    status: JobStatus
}

class JobStatusTag extends Component<Props> {
    render () {
        const { status } = this.props;
        switch(status) {
            case 'requires_invoicing': return <Tag text="Requires invoicing" color="accent-1" />;
            case 'action_required': return <Tag text="Action required" color="accent-2" />;
            case 'has_late_visit': return <Tag text="Has a late visit" color="accent-3" />;
            case 'today': return <Tag text="Today" color="accent-1" />;
            case 'upcoming': return <Tag text="Upcoming" color="accent-1" />;
            case 'archived': return <Tag text="Archived" color="accent-3" />;
            default:
          }
    }
}


export default JobStatusTag