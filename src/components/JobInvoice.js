// @flow

import React, { Component } from "react";
// import { injectIntl, FormattedMessage } from "react-intl";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
// import { addSuccess, addError } from "redux-flash-messages";
import Layer from "grommet/components/Layer";
// import Paragraph from "grommet/components/Paragraph";
import InvoiceBatchJob from "./InvoiceBatchJob";
import type { Job } from "../actions/jobs";
import type { Dispatch } from "../types/Store";
import type { State } from "../types/State";

// const intlTitle = (
//   <FormattedMessage
//     id="jobClose.title"
//     description="Job close title"
//     defaultMessage="Close job"
//   />
// );

// const intlSubmitLabel = (
//   <FormattedMessage
//     id="jobClose.submitLabel"
//     description="Job close submit label"
//     defaultMessage="Yes, close"
//   />
// );

// const intlHasIncompleteVisitsParagraph1 = (id: number) => (
//   <FormattedMessage
//     id="jobClose.hasIncompleteVisitsParagraph1"
//     description="Job close has incomplete visits paragraph 1"
//     defaultMessage="Are you sure you want to close job {id}?"
//     values={{id: <strong>#{id}</strong>}}
//   />
// );

// const intlHasIncompleteVisitsParagraph2 = (
//   <FormattedMessage
//     id="jobClose.hasIncompleteVisitsParagraph2"
//     description="Job close has incomplete visits paragraph 2"
//     defaultMessage="This will remove all incomplete visits."
//   />
// );

// const intlNoIncompleteVisitsParagraph1 = (id: number) => (
//   <FormattedMessage
//     id="jobClose.noIncompleteVisitsParagraph1"
//     description="Job close no incomplete visits paragraph 1"
//     defaultMessage="Job {id} has no upcoming visits."
//     values={{id: <strong>#{id}</strong>}}
//   />
// );

// const intlNoIncompleteVisitsParagraph2 = (
//   <FormattedMessage
//     id="jobClose.noIncompleteVisitsParagraph2"
//     description="Job close no incomplete visits paragraph 2"
//     defaultMessage="Do you want close this job?"
//   />
// );

type Props = {
  job: Job,
  onClose: Function,
  dispatch: Dispatch
};

class JobInvoice extends Component<Props> {
  render() {
    const { job, onClose } = this.props;

    return (
      <Layer align="right" closer={true} onClose={onClose}>
        <InvoiceBatchJob job={job} visits={[]} selected={{}} />
      </Layer>
    );
  }
}

export default injectIntl(JobInvoice);
