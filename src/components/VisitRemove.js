// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteVisit } from '../actions/visits';
import LayerForm from "grommet-templates/components/LayerForm";
import Paragraph from "grommet/components/Paragraph";
import type { Visit } from "../actions/visits";
import type { Dispatch } from "../types/Store";
import type {State} from '../types/State';

type Props = {
  visit: Visit,
  onClose: Function,
  onRemove: Function,
  dispatch: Dispatch,
  token: ?string
};

class VisitRemove extends Component<Props> {

  _onRemove = () => {
    const { visit, token } = this.props;
    if(token) {
      this.props.dispatch(deleteVisit(visit, token));
      this.props.onRemove();
    }
  }

  render() {
    const { visit, onClose } = this.props;
    return (
      <LayerForm
        title="Remove"
        submitLabel="Yes, remove"
        compact={true}
        onClose={onClose}
        onSubmit={this._onRemove}
      >
        <fieldset>
          <Paragraph>
            Are you sure you want to
            remove visit for <strong>{visit.client_name}</strong>?
          </Paragraph>
        </fieldset>
      </LayerForm>
    );
  }
}

const mapStateToProps = (
  {auth}: State,
): * => ({
  token: auth.token
});

// const mapDispatchToProps = (dispatch: *) =>
//   bindActionCreators(
//     {
//       deleteClient,
//     },
//     dispatch
//   );

export default connect(mapStateToProps)(VisitRemove);
