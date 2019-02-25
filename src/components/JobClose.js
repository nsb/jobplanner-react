// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { partialUpdateJob } from '../actions/jobs';
import LayerForm from "grommet-templates/components/LayerForm";
import Paragraph from "grommet/components/Paragraph";
import type { Job } from "../actions/jobs";
import type { Dispatch } from "../types/Store";
import type { State } from '../types/State';

type Props = {
  job: Job,
  onClose: Function,
  dispatch: Dispatch,
  token: string
};

class JobClose extends Component<Props> {

  _onClose = () => {
    const { job, token } = this.props;
    this.props.dispatch(partialUpdateJob({ id: job.id, closed: true }, token));
    this.props.onClose();
  }

  render() {
    const { job, onClose } = this.props;

    let formContent = job.incomplete_visit_count ?
      <fieldset>
        <Paragraph>
          Are you sure you want to close job <strong>#{`${job.id}`}</strong> for <strong>{`${job.client_firstname} ${job.client_lastname}`}</strong>?
        </Paragraph>
        <Paragraph>
          This will remove all incomplete visits.
        </Paragraph>
      </fieldset> :
      <fieldset>
        <Paragraph>
        Job <strong>#{`${job.id}`}</strong> for <strong>{`${job.client_firstname} ${job.client_lastname}`}</strong> has no upcoming visits.
        </Paragraph>
        <Paragraph>
          Do you want close this job?
        </Paragraph>
      </fieldset>

    return (
      <LayerForm
        title="Close job"
        submitLabel="Yes, close"
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

export default connect(mapStateToProps)(JobClose);
