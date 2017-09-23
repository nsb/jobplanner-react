// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import List from "grommet/components/List";
import NavControl from "./NavControl";
import BusinessSection from "./SettingsBusinessSection";
import SettingsServicesSection from "./SettingsServicesSection";
import BusinessEdit from "./SettingsBusinessEdit";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { ensureState } from "redux-optimistic-ui";
import type { Business } from "../actions/businesses";
import type { Element } from "react";

const LAYERS: {
  servicesEdit: Element<*> | null
} = {
  businessEdit: BusinessEdit,
  servicesEdit: null
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
          <SettingsServicesSection
            onOpen={this.onLayerOpen.bind(this, "servicesEdit")}
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
      layer = <Layer onClose={this.onLayerClose} {...this.props} />;
    }
    return layer;
  }

  onLayerOpen = (name: string) => {
    this.setState({ layer: name });
  }

  onLayerClose = (nextLayer: string | null = null) => {
    if (nextLayer && typeof nextLayer !== "string") {
      nextLayer = null;
    }
    this.setState({ layer: nextLayer });
  }
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
    push: ownProps.history.push,
  };
};

export default connect(mapStateToProps)(SettingsEdit);
