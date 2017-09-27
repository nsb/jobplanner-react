// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { ensureState } from "redux-optimistic-ui";
import type { Business } from "../actions/businesses";
import type { Service } from "../actions/services";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { updateService } from "../actions/services";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Accordion from "grommet/components/Accordion";
import AccordionPanel from "grommet/components/AccordionPanel";
import Paragraph from "grommet/components/Paragraph";
import ServiceForm from "./SettingsServiceForm";

type Props = {
  business: Business,
  services: Array<Service>,
  onClose: Function,
  dispatch: Dispatch,
  token: string
};

type State = {
  activePanel?: number
}

class ServiceList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { services } = props;
    this.state = { activePanel: services.length };
  }

  render() {
    const { services } = this.props;
    return (
      <Box>
        <Header size="large" justify="between" pad="none">
          <Heading tag="h2" margin="none" strong={true}>
            Services
          </Heading>
        </Header>
        <Accordion onActive={this.onActive} active={this.state.activePanel}>
          {services.map((service, index: number) => {
            return (
              <AccordionPanel heading={service.name} key={service.id}>
                <Paragraph>
                  <ServiceForm
                    form={`serviceform-${service.id}`}
                    initialValues={service}
                    onSubmit={this.onSubmit}
                  />
                </Paragraph>
              </AccordionPanel>
            );
          })}
          <AccordionPanel heading="Add service" key="service-new">
            <Paragraph>
              <ServiceForm
                form={`serviceform-new`}
                onSubmit={this.onSubmit}
              />
            </Paragraph>
          </AccordionPanel>
        </Accordion>
      </Box>
    );
  }

  onActive = (activePanel: number) => {
    if (!activePanel) {
      const { services } = this.props;
      this.setState({activePanel: services.length })
    }
  }

  onSubmit = (service: Service) => {
    const { dispatch, token } = this.props;
    console.log(service);
    dispatch(updateService(service, token));
  };
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
