// @flow
import React, { Component } from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Tag from "./Tag";
import type { JobStatus } from "../actions/jobs";

const intlRequiresInvoicing = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobStatusTag.requiresInvoicing"
    description="Job status tag requires invoicing"
    defaultMessage="Requires invoicing"
  />
)

const intlActionRequired = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobStatusTag.actionRequired"
    description="Job status tag action required"
    defaultMessage="Action required"
  />
)

const intlHasLateVisit = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobStatusTag.hasLateVisit"
    description="Job status tag has late visit"
    defaultMessage="Has late visit"
  />
)

const intlToday = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobStatusTag.today"
    description="Job status tag today"
    defaultMessage="Today"
  />
)

const intlUpcoming = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobStatusTag.upcoming"
    description="Job status tag upcoming"
    defaultMessage="Upcoming"
  />
)

const intlArchived = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobStatusTag.archived"
    description="Job status tag archived"
    defaultMessage="Archived"
  />
)

type Props = {
    status: JobStatus
}

class JobStatusTag extends Component<Props & { intl: intlShape }> {
    render () {
        const { status, intl } = this.props;
        switch(status) {
            case 'requires_invoicing': return <Tag text={intl.formatMessage({id: "jobStatusTag.requiresInvoicing"})} color="accent-2" />;
            case 'action_required': return <Tag text={intl.formatMessage({id: "jobStatusTag.actionRequired"})} color="warning" />;
            case 'has_late_visit': return <Tag text={intl.formatMessage({id: "jobStatusTag.hasLateVisit"})} color="critical" />;
            case 'today': return <Tag text={intl.formatMessage({id: "jobStatusTag.today"})} color="neutral-2" />;
            case 'upcoming': return <Tag text={intl.formatMessage({id: "jobStatusTag.upcoming"})} color="ok" />;
            case 'archived': return <Tag text={intl.formatMessage({id: "jobStatusTag.archived"})} color="unknown" />;
            default: return null
          }
    }
}


export default injectIntl(JobStatusTag);