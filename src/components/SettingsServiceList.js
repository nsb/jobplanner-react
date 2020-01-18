// @flow

import { merge } from "lodash/object";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import { ensureState } from "redux-optimistic-ui";
import type { Business } from "../actions/businesses";
import type { Service } from "../actions/services";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { createService, updateService } from "../actions/services";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Accordion from "grommet/components/Accordion";
import AccordionPanel from "grommet/components/AccordionPanel";
import Paragraph from "grommet/components/Paragraph";
import ServiceForm from "./SettingsServiceForm";
import { AuthContext } from "../providers/authProvider";

const intlHeading = (
  <FormattedMessage
    id="settingsServiceList.heading"
    description="Settings service list heading"
    defaultMessage="Services"
  />
);
const intlAccordionHeading = (
  <FormattedMessage
    id="settingsServiceList.accordionHeading"
    description="Settings service list accordion add label"
    defaultMessage="Add service"
  />
);

type Props = {
  business: Business,
  services: Array<Service>,
  dispatch: Dispatch
};

type State = {
  activePanel?: number
};

class ServiceList extends Component<Props & { intl: intlShape }, State> {
  static contextType = AuthContext;

  constructor(props: Props & { intl: intlShape }) {
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
            {intlHeading}
          </Heading>
        </Header>
        <Accordion onActive={this.onActive}>
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
          <AccordionPanel heading={intlAccordionHeading} key="service-new">
            <Paragraph>
              <ServiceForm form={`serviceform-new`} onSubmit={this.onSubmit} />
            </Paragraph>
          </AccordionPanel>
        </Accordion>
      </Box>
    );
  }

  onActive = (activePanel?: number) => {
    if (!activePanel) {
      const { services } = this.props;
      this.setState({ activePanel: services.length });
    }
  };

  onSubmit = (service: Service) => {
    const { business, dispatch, intl } = this.props;
    const { getUser } = this.context;

    if (service.id) {
      getUser()
        .then(({ access_token }) => {
          return dispatch(updateService(service, access_token));
        })
        .then((responseService: Service) => {
          addSuccess({ text: intl.formatMessage({ id: "flash.saved" }) });
        })
        .catch(() => {
          addError({ text: intl.formatMessage({ id: "flash.error" }) });
        });
    } else {
      getUser()
        .then(({ access_token }) => {
          return dispatch(
            createService(
              merge({}, { business: business.id }, service),
              access_token
            )
          );
        })
        .then((responseService: Service) => {
          addSuccess({ text: intl.formatMessage({ id: "flash.saved" }) });
        })
        .catch(() => {
          addError({ text: intl.formatMessage({ id: "flash.error" }) });
        })
        .finally(this.onActive);
    }
  };
}

const mapStateToProps = (
  { services, entities }: ReduxState,
  ownProps: {
    business: Business,
    dispatch: Dispatch
  }
): Props => ({
  business: ownProps.business,
  services: services.result
    .map((Id: number) => {
      return ensureState(entities).services[Id];
    })
    .filter(service => {
      return service.business === ownProps.business.id ? service : false;
    }),
  dispatch: ownProps.dispatch
});

export default connect(mapStateToProps)(injectIntl(ServiceList));
