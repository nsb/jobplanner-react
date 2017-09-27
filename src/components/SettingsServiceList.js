// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { ensureState } from "redux-optimistic-ui";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Accordion from "grommet/components/Accordion";
import AccordionPanel from "grommet/components/AccordionPanel";
import Paragraph from "grommet/components/Paragraph";
import ServiceForm from "./SettingsServiceForm";

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
      <Box>
        <Header size="large" justify="between" pad="none">
          <Heading tag="h2" margin="none" strong={true}>
            Services
          </Heading>
        </Header>
        <Accordion>
          {services.map((service: Object, index: number) => {
            return (
              <AccordionPanel heading={service.name} key={service.id}>
                <Paragraph>
                  <ServiceForm
                    form={`serviceform-${service.id}`}
                    initialValues={service}
                  />
                </Paragraph>
              </AccordionPanel>
            );
          })}
        </Accordion>
      </Box>
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
