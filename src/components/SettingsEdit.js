// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import List from "grommet/components/List";
import NavControl from "./NavControl";
import BusinessSection from "./SettingsBusinessSection";
import ServicesSection from "./SettingsServicesSection";
import EmployeesSection from "./SettingsEmployeesSection";
import EmailsSection from "./SettingsEmailsSection";
import BusinessEdit from "./SettingsBusinessEdit";
import ServicesEdit from "./SettingsServicesEdit";
import FieldsEdit from "./SettingsFieldsEdit";
import EmployeesEdit from "./SettingsEmployeesEdit";
import EmailsEdit from "./SettingsEmailsEdit";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { ensureState } from "redux-optimistic-ui";
import type { Business } from "../actions/businesses";

const LAYERS: {} = {
  businessEdit: BusinessEdit,
  servicesEdit: ServicesEdit,
  employeesEdit: EmployeesEdit,
  fieldsEdit: FieldsEdit,
  emailsEdit: EmailsEdit
};

type Props = {
  business: Business
};

type State = {
  layer: string | null
};

class SettingsEdit extends Component<Props, State> {
  state = {
    layer: null
  };

  render() {
    let layer = this.renderLayer();

    return (
      <Box flex={true}>
        <Header size="large" pad={{ horizontal: "medium" }}>
          <Title responsive={false}>
            <NavControl />
            <span>Settings</span>
          </Title>
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

  handleSubmit = e => {
    console.log(e);
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number } },
    history: { push: Function },
    dispatch: Dispatch
  }
): Props => {
  const { businesses, entities, auth } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: ensureState(entities).businesses[businessId],
    isFetching: businesses.isFetching,
    token: auth.token,
    dispatch: ownProps.dispatch,
    push: ownProps.history.push
  };
};

export default connect(mapStateToProps)(SettingsEdit);
