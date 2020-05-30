// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { injectIntl, FormattedMessage, intlShape } from "react-intl";
import { connect } from "react-redux";
import { addSuccess, addError } from "redux-flash-messages";
import LayerForm from "grommet-templates/components/LayerForm";
import Paragraph from "grommet/components/Paragraph";
import { AuthContext } from "../providers/authProvider";
import { deleteJob } from "../actions/jobs";
import type { Job } from "../actions/jobs";
import type { Dispatch } from "../types/Store";
import type { State } from "../types/State";

const intlTitle = (
  <FormattedMessage
    id="jobRemove.title"
    description="Job remove title"
    defaultMessage="Remove job"
  />
);

const intlSubmitLabel = (
  <FormattedMessage
    id="jobRemove.submitLabel"
    description="Job remove submit label"
    defaultMessage="Yes, remove"
  />
);

const intlParagraph1 = (id: number) => (
  <FormattedMessage
    id="jobRemove.hasIncompleteVisitsParagraph1"
    description="Job remove has incomplete visits paragraph 1"
    defaultMessage="Are you sure you want to remove job {id}?"
    values={{ id: <strong>#{id}</strong> }}
  />
);

const intlParagraph2 = (
  <FormattedMessage
    id="jobRemove.hasIncompleteVisitsParagraph2"
    description="Job remove has incomplete visits paragraph 2"
    defaultMessage="This will remove all visits for the job."
  />
);

type Props = {
  job: Job,
  onClose: Function,
  dispatch: Dispatch,
  deleteJob: Function,
  history: { push: string => void },
  isFetching: boolean
};

class JobRemove extends Component<Props & { intl: intlShape }> {
  static contextType = AuthContext;

  onRemove = () => {
    const { job, deleteJob, intl, history } = this.props;
    if (job) {
      const { getUser } = this.context;
      getUser().then(({ access_token }) => {
        return deleteJob(job, access_token)
      }).then((responseJob: Job) => {
        addSuccess({ text: intl.formatMessage({ id: "flash.deleted" }) });
        history.push(`/${job.business}/jobs`);
      })
      .catch(() => {
        addError({ text: intl.formatMessage({ id: "flash.error" }) });
      });
    }
  };

  render() {
    const { job, onClose, isFetching } = this.props;

    let formContent = (
      <fieldset>
        <Paragraph>{intlParagraph1(job.id)}</Paragraph>
        <Paragraph>{intlParagraph2}</Paragraph>
      </fieldset>
    );

    return (
      <LayerForm
        title={intlTitle}
        submitLabel={intlSubmitLabel}
        compact={true}
        onClose={onClose}
        onSubmit={this.onRemove}
        busy={isFetching}
      >
        {formContent}
      </LayerForm>
    );
  }
}

const mapStateToProps = (
  state: State,
  ownProps: { deleteJob: Function, history: { push: string => void }}
): * => ({
  deleteJob: ownProps.deleteJob,
  history: ownProps.history
});

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators(
    {
      deleteJob
    },
    dispatch
  );

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(JobRemove)));
