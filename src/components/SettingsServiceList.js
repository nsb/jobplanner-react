// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { ensureState } from "redux-optimistic-ui";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import Accordion from "grommet/components/Accordion";
import AccordionPanel from "grommet/components/AccordionPanel";
import Paragraph from "grommet/components/Paragraph";

type Props = {
  business: Business,
  services: Array<Object>,
  onClose: Function,
  dispatch: Dispatch,
  token: string
};

class ServiceList extends Component<Props> {
  render() {
    const { services } = this.props;
    return (
      <Accordion>
        {services.map((service: Object, index: number) => {
          return (
            <AccordionPanel heading="First Title">
              <Paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Paragraph>
            </AccordionPanel>
          );
        })}
      </Accordion>
    );
  }
}

const mapStateToProps = (
  { auth, entities }: ReduxState,
  ownProps: {
    business: Business,
    dispatch: Dispatch
  }
) => ({
  token: auth.token,
  business: ownProps.business,
  services: ownProps.business.services.map((Id: number) => {
    return ensureState(entities).services[Id];
  }),

  dispatch: ownProps.dispatch
});

export default connect(mapStateToProps)(ServiceList);
