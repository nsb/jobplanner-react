// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteClient } from '../actions/clients';
import LayerForm from "grommet-templates/components/LayerForm";
import Paragraph from "grommet/components/Paragraph";
import type { Client } from "../actions/clients";
import type { Dispatch } from "../types/Store";
import type {State} from '../types/State';

class ClientRemove extends Component {
  props: {
    client: Client,
    onClose: Function,
    dispatch: Dispatch,
    token: string
  };

  _onRemove = () => {
    const { client, token } = this.props;
    this.props.dispatch(deleteClient(client, token));
    this.props.onClose();
  }

  render() {
    const { client, onClose } = this.props;
    return (
      <LayerForm
        title="Remove"
        submitLabel="Yes, remove"
        compact={true}
        onClose={this.props.onClose}
        onSubmit={this._onRemove}
      >
        <fieldset>
          <Paragraph>
            Are you sure you want to
            remove <strong>{client.first_name}</strong>?
          </Paragraph>
        </fieldset>
      </LayerForm>
    );
  }
}

const mapStateToProps = (
  {auth}: State,
) => ({
  token: auth.token
});

// const mapDispatchToProps = (dispatch: *) =>
//   bindActionCreators(
//     {
//       deleteClient,
//     },
//     dispatch
//   );

export default connect(mapStateToProps)(ClientRemove);
