// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl, FormattedMessage } from "react-intl";
import Box from "grommet/components/Box";
import List from "grommet/components/List";
import Header from "grommet/components/Header";
import NavControl from "./NavControl";
import BusinessSection from "./SettingsBusinessSection";
import ServicesSection from "./SettingsServicesSection";
import EmployeesSection from "./SettingsEmployeesSection";
import EmailsSection from "./SettingsEmailsSection";
import CalendarSyncSection from "./SettingsCalendarSyncSection";
import BusinessEdit from "./SettingsBusinessEdit";
import ServicesEdit from "./SettingsServicesEdit";
import FieldsEdit from "./SettingsFieldsEdit";
import EmployeesEdit from "./SettingsEmployeesEdit";
import EmailsEdit from "./SettingsEmailsEdit";
import CalendarSyncEdit from "./SettingsCalendarSyncEdit";
import type { State as ReduxState } from "../types/State";
import { ensureState } from "redux-optimistic-ui";
import type { Business } from "../actions/businesses";

const intlTitle = (
  <FormattedMessage
    id="settings.title"
    description="Settings title"
    defaultMessage="Settings"
  />
);

const LAYERS: {} = {
  businessEdit: BusinessEdit,
  servicesEdit: ServicesEdit,
  employeesEdit: EmployeesEdit,
  fieldsEdit: FieldsEdit,
  emailsEdit: EmailsEdit,
  calendarSyncEdit: CalendarSyncEdit,
};

type Props = {|
  business: Business,
|};

type State = {
  layer: string | null,
};

class SettingsEdit extends Component<Props, State> {
  state = {
    layer: null,
  };

  render() {
    let layer = this.renderLayer();

    return (
      <Box flex={true}>
        <Header size="large" pad={{ horizontal: "medium" }}>
          <NavControl title={intlTitle} />
        </Header>
        <List>
          <BusinessSection
            onOpen={this.onLayerOpen.bind(this, "businessEdit")}
          />
          <ServicesSection
            onOpen={this.onLayerOpen.bind(this, "servicesEdit")}
          />
          <EmployeesSection
            onOpen={this.onLayerOpen.bind(this, "employeesEdit")}
          />
          <EmailsSection onOpen={this.onLayerOpen.bind(this, "emailsEdit")} />
          <CalendarSyncSection
            onOpen={this.onLayerOpen.bind(this, "calendarSyncEdit")}
          />
        </List>
        {layer}
      </Box>
    );
  }

  renderLayer = () => {
    let layer;
    if (this.state.layer) {
      const Layer = LAYERS[this.state.layer];
      layer = (
        <Layer
          onClose={this.onLayerClose}
          handleSubmit={this.handleSubmit}
          {...this.props}
        />
      );
    }
    return layer;
  };

  onLayerOpen = (name: string) => {
    this.setState({ layer: name });
  };

  onLayerClose = (nextLayer: string | null = null) => {
    if (nextLayer && typeof nextLayer !== "string") {
      nextLayer = null;
    }
    this.setState({ layer: nextLayer });
  };

  handleSubmit = (e) => {};
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number } },
  }
): Props => {
  const { entities } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: ensureState(entities).businesses[businessId],
  };
};

export default connect(mapStateToProps)(injectIntl(SettingsEdit));
