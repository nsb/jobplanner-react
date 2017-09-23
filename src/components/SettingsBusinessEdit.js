// @flow

import React, { Component } from "react";
import { updateBusiness } from '../actions/businesses';
import LayerForm from "grommet-templates/components/LayerForm";
import Paragraph from "grommet/components/Paragraph";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";

type Props = {
  business: Business,
  onClose: Function,
  dispatch: Dispatch,
  token: string
};

class BusinessEdit extends Component<Props> {

  _onRemove = () => {
    const { business, token } = this.props;
    this.props.dispatch(updateBusiness(business, token));
    this.props.onClose();
  }

  render() {
    const { business, onClose } = this.props;
    return (
      <LayerForm
        title="Edit"
        submitLabel="Edit"
        compact={true}
        onClose={onClose}
        onSubmit={undefined}
      >
        <fieldset>
          <Paragraph>
            Are you sure you want to
            edit <strong>{business.name}</strong>?
          </Paragraph>
        </fieldset>
      </LayerForm>
    );
  }
}

export default BusinessEdit;
