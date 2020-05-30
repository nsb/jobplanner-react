import React, { Component } from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Tag from "./Tag";
import type { VisitStatus } from "../actions/visits";

const intlCompleted = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="visitStatusTag.completed"
    description="Visit status tag completed"
    defaultMessage="Completed"
  />
);

const intlUpcoming = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="visitStatusTag.upcoming"
    description="Visit status tag upcoming"
    defaultMessage="Upcoming"
  />
);

const intlOverdue = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="visitStatusTag.overdue"
    description="Visit status tag overdue"
    defaultMessage="Overdue"
  />
);

type Props = {
  status: VisitStatus,
};

class VisitStatusTag extends Component<Props & { intl: intlShape }> {
  render() {
    const { status, intl } = this.props;
    switch (status) {
      case "completed":
        return (
          <Tag
            text={intl.formatMessage({ id: "visitStatusTag.completed" })}
            color="neutral-2"
          />
        );
      case "upcoming":
        return (
          <Tag
            text={intl.formatMessage({ id: "visitStatusTag.upcoming" })}
            color="ok"
          />
        );
      case "overdue":
        return (
          <Tag
            text={intl.formatMessage({ id: "visitStatusTag.overdue" })}
            color="critical"
          />
        );
      default:
        return null;
    }
  }
}

export default injectIntl(VisitStatusTag);
