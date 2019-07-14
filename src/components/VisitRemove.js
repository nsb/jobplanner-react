// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import { deleteVisit } from '../actions/visits';
import LayerForm from "grommet-templates/components/LayerForm";
import Paragraph from "grommet/components/Paragraph";
import type { Visit } from "../actions/visits";
import type { Dispatch } from "../types/Store";
import type {State} from '../types/State';

const intlTitle = (
  <FormattedMessage
    id="visitRemove.title"
    description="Visit remove title"
    defaultMessage="Remove"
  />
)

const intlParagraph = (name: string) => (
  <FormattedMessage
    id="visitRemove.paragraph1"
    description="Visit remove paragraph 1"
    defaultMessage="Are you sure you want to remove visit for {name}?"
    values={{name}}
  />
)

const intlSubmit = (
  <FormattedMessage
    id="visitRemove.submitLabel"
    description="Visit remove submit label"
    defaultMessage="Yes, remove"
  />
)

type Props = {
  visit: Visit,
  onClose: Function,
  onRemove: Function,
  dispatch: Dispatch,
  token: ?string
};

class VisitRemove extends Component<Props & { intl: intlShape }> {

  _onRemove = () => {
    const { visit, token, dispatch, onRemove, intl } = this.props;
    if(token) {
      dispatch(deleteVisit(visit, token)).then(
        () => {
          addSuccess({text: intl.formatMessage({id: "flash.deleted"})});
        }).catch(() => {
          addError({text: intl.formatMessage({id: "flash.error"})});
        }
      ).finally(onRemove);
    }
  }

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
          <Paragraph>
            {intlParagraph(visit.client_name)}
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

export default connect(mapStateToProps)(injectIntl(VisitRemove));
