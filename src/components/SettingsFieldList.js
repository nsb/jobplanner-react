// @flow

import { merge } from "lodash/object";
import React, { Component } from "react";
import { connect } from "react-redux";
import { ensureState } from "redux-optimistic-ui";
import type { Business } from "../actions/businesses";
import type { Field } from "../actions/fields";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { createField, updateField } from "../actions/fields";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Accordion from "grommet/components/Accordion";
import AccordionPanel from "grommet/components/AccordionPanel";
import Paragraph from "grommet/components/Paragraph";
import FieldForm from "./SettingsFieldForm";
import { AuthContext } from "../providers/authProvider";

type Props = {
  business: Business,
  fields: Array<Field>,
  dispatch: Dispatch
};

type State = {
  activePanel?: number
};

class FieldList extends Component<Props, State> {
  static contextType = AuthContext;

  constructor(props: Props) {
    super(props);
    const { fields } = props;
    this.state = { activePanel: fields.length };
  }

  render() {
    const { fields } = this.props;
    return (
      <Box>
        <Header size="large" justify="between" pad="none">
          <Heading tag="h2" margin="none" strong={true}>
            Fields
          </Heading>
        </Header>
        <Accordion onActive={this.onActive} active={this.state.activePanel}>
          {fields.map((field, index: number) => {
            return (
              <AccordionPanel heading={field.label} key={field.id}>
                <Paragraph>
                  <FieldForm
                    form={`fieldform-${field.id}`}
                    initialValues={field}
                    onSubmit={this.onSubmit}
                  />
                </Paragraph>
              </AccordionPanel>
            );
          })}
          <AccordionPanel heading="Add field" key="field-new">
            <Paragraph>
              <FieldForm form={`fieldform-new`} onSubmit={this.onSubmit} />
            </Paragraph>
          </AccordionPanel>
        </Accordion>
      </Box>
    );
  }

  onActive = (activePanel?: number) => {
    if (!activePanel) {
      const { fields } = this.props;
      this.setState({ activePanel: fields.length });
    }
  };

  onSubmit = (field: Field) => {
    const { business, dispatch } = this.props;
    const { getUser } = this.context;
    getUser().then(({ access_token }) => {  
      if (field.id) {
        dispatch(updateField(field, access_token));
      } else {
        dispatch(
          createField(merge({}, { business: business.id }, field), access_token)
        );
        this.onActive();
      }
    });
  };
}

const mapStateToProps = (
  { fields, entities }: ReduxState,
  ownProps: {
    business: Business,
    dispatch: Dispatch
  }
): Props => ({
  business: ownProps.business,
  fields: fields.result
    .map((Id: number) => {
      return ensureState(entities).fields[Id];
    })
    .filter(field => {
      console.log(ownProps, field)
      return field.business === ownProps.business.id ? field : false;
    }),
  dispatch: ownProps.dispatch
});

export default connect(mapStateToProps)(FieldList);
