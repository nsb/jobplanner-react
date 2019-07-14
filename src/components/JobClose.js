// @flow

import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { addSuccess, addError } from "redux-flash-messages";
import { partialUpdateJob } from '../actions/jobs';
import LayerForm from "grommet-templates/components/LayerForm";
import Paragraph from "grommet/components/Paragraph";
import type { Job } from "../actions/jobs";
import type { Dispatch } from "../types/Store";
import type { State } from '../types/State';

const intlTitle = (
  <FormattedMessage
    id="jobClose.title"
    description="Job close title"
    defaultMessage="Close job"
  />
);

const intlSubmitLabel = (
  <FormattedMessage
    id="jobClose.submitLabel"
    description="Job close submit label"
    defaultMessage="Yes, close"
  />
);

const intlHasIncompleteVisitsParagraph1 = (id: number) => (
  <FormattedMessage
    id="jobClose.hasIncompleteVisitsParagraph1"
    description="Job close has incomplete visits paragraph 1"
    defaultMessage="Are you sure you want to close job {id}?"
    values={{id: <strong>#{id}</strong>}}
  />
);

const intlHasIncompleteVisitsParagraph2 = (
  <FormattedMessage
    id="jobClose.hasIncompleteVisitsParagraph2"
    description="Job close has incomplete visits paragraph 2"
    defaultMessage="This will remove all incomplete visits."
  />
);

const intlNoIncompleteVisitsParagraph1 = (id: number) => (
  <FormattedMessage
    id="jobClose.noIncompleteVisitsParagraph1"
    description="Job close no incomplete visits paragraph 1"
    defaultMessage="Job {id} has no upcoming visits."
    values={{id: <strong>#{id}</strong>}}
  />
);

const intlNoIncompleteVisitsParagraph2 = (
  <FormattedMessage
    id="jobClose.noIncompleteVisitsParagraph2"
    description="Job close no incomplete visits paragraph 2"
    defaultMessage="Do you want close this job?"
  />
);

type Props = {
  job: Job,
  onClose: Function,
  dispatch: Dispatch,
  token: string
};

class JobClose extends Component<Props> {

  _onClose = () => {
    const { job, token, dispatch, intl, onClose } = this.props;
    dispatch(
      partialUpdateJob({ id: job.id, closed: true }, token)).then(
        (responseJob: Job) => {
          addSuccess({text: intl.formatMessage({id: "flash.saved"})});
      }).catch(() => {
        addError({text: intl.formatMessage({id: "flash.error"})});
      }).finally(onClose);
  }

  render() {
    const { job, onClose } = this.props;

    let formContent = job.incomplete_visit_count ?
      <fieldset>
        <Paragraph>
          {intlHasIncompleteVisitsParagraph1(job.id)}
        </Paragraph>
        <Paragraph>
          {intlHasIncompleteVisitsParagraph2}
        </Paragraph>
      </fieldset> :
      <fieldset>
        <Paragraph>
          {intlNoIncompleteVisitsParagraph1(job.id)}
        </Paragraph>
        <Paragraph>
          {intlNoIncompleteVisitsParagraph2}
        </Paragraph>
      </fieldset>

    return (
      <LayerForm
        title={intlTitle}
        submitLabel={intlSubmitLabel}
        compact={true}
        onClose={onClose}
        onSubmit={this._onClose}
      >
        {formContent}
      </LayerForm>
    );
  }
}

const mapStateToProps = (
  { auth }: State,
): * => ({
  token: auth.token
});

// const mapDispatchToProps = (dispatch: *) =>
//   bindActionCreators(
//     {
//       partialUpdateJob,
//     },
//     dispatch
//   );

export default connect(mapStateToProps)(injectIntl(JobClose));
