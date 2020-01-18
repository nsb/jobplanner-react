// @flow

import React, { Component } from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import { deleteVisit } from "../actions/visits";
import LayerForm from "grommet-templates/components/LayerForm";
import Paragraph from "grommet/components/Paragraph";
import { AuthContext } from "../providers/authProvider";
import type { Visit } from "../actions/visits";
import type { Dispatch } from "../types/Store";

const intlTitle = (
  <FormattedMessage
    id="visitRemove.title"
    description="Visit remove title"
    defaultMessage="Remove"
  />
);

const intlParagraph = (name: string) => (
  <FormattedMessage
    id="visitRemove.paragraph1"
    description="Visit remove paragraph 1"
    defaultMessage="Are you sure you want to remove visit for {name}?"
    values={{ name }}
  />
);

const intlSubmit = (
  <FormattedMessage
    id="visitRemove.submitLabel"
    description="Visit remove submit label"
    defaultMessage="Yes, remove"
  />
);

type Props = {
  visit: Visit,
  onClose: Function,
  onRemove: Function,
  dispatch: Dispatch
};

class VisitRemove extends Component<Props & { intl: intlShape }> {
  static contextType = AuthContext;

  _onRemove = () => {
    const { visit, dispatch, onRemove, intl } = this.props;
    const { getUser } = this.context;
    getUser().then(({ access_token }) => {
      dispatch(deleteVisit(visit, access_token))
        .then(() => {
          addSuccess({ text: intl.formatMessage({ id: "flash.deleted" }) });
        })
        .catch(() => {
          addError({ text: intl.formatMessage({ id: "flash.error" }) });
        })
        .finally(onRemove);
    });
  };

  render() {
    const { visit, onClose } = this.props;
    return (
      <LayerForm
        title={intlTitle}
        submitLabel={intlSubmit}
        compact={true}
        onClose={onClose}
        onSubmit={this._onRemove}
      >
        <fieldset>
          <Paragraph>{intlParagraph(visit.client_name)}</Paragraph>
        </fieldset>
      </LayerForm>
    );
  }
}

export default injectIntl(VisitRemove);
