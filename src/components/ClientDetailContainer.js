// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchClient } from "../actions/clients";
import { fetchJobs } from "../actions/jobs";
import { navResponsive } from "../actions/nav";
import Article from "grommet/components/Article";
import Section from "grommet/components/Section";
import Spinning from "grommet/components/icons/Spinning";
import ClientDetail from "./ClientDetail";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Client } from "../actions/clients";
import type { Business } from "../actions/businesses";
import type { Property } from "../actions/properties";
import type { Job } from "../actions/jobs";
import type { Responsive } from "../actions/nav";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  business: Business,
  client: Client,
  properties: Array<Property>,
  jobs: Array<Job>,
  clientId: number,
  token: ?string,
  isFetching: boolean,
  dispatch: Dispatch,
  push: string => void,
  responsive: Responsive
};

class ClientDetailContainer extends Component<Props> {
  componentDidMount() {
    const { client, clientId, token, dispatch } = this.props;
    if (!client && token) {
      dispatch(fetchClient(token, clientId));
    }
    if (token) {
      dispatch(fetchJobs(token, { client: clientId }));
    }
  }

  render() {
    const {
      business,
      client,
      properties,
      jobs,
      responsive,
      isFetching,
      push
    } = this.props;

    const clientDetail = (
      <ClientDetail
        business={business}
        client={client}
        properties={properties}
        jobs={jobs}
        responsive={responsive}
        onEdit={this.onEdit}
        onClose={this.onClose}
        onResponsive={this.onResponsive}
        push={push}
      />
    );

    const loadingClients = (
      <Article scrollStep={true} controls={true}>
        <Section
          full={true}
          colorIndex="dark"
          // texture="url(img/ferret_background.png)"
          pad="large"
          justify="center"
          align="center"
        >
          <Spinning />
        </Section>
      </Article>
    );

    return isFetching ? loadingClients : clientDetail;
  }

  onResponsive = (responsive: Responsive) => {
    this.props.dispatch(navResponsive(responsive));
  };

  onClose = () => {
    const { business, client, push } = this.props;
    push(`/${business.id}/clients/${client.id}`);
  };

  onEdit = () => {
    const { business, client, push } = this.props;
    push(`/${business.id}/clients/${client.id}/edit`);
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number, clientId: number } },
    history: { push: Function },
    dispatch: Dispatch
  }
): Props => {
  const { clients, jobs, entities, auth, nav } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const clientId = parseInt(ownProps.match.params.clientId, 10);
  const client = ensureState(entities).clients[clientId];

  return {
    business: ensureState(entities).businesses[businessId],
    client: client,
    // properties: client.properties.map((propertyId => {
    //   return ensureState(entities).properties[propertyId]
    // })),
    properties: client
      ? client.properties.map(propertyId => {
          return ensureState(entities).properties[propertyId];
        })
      : [],
    jobs: jobs.result
      .map(Id => {
        return ensureState(entities).jobs[Id];
      })
      .filter(job => job.client === clientId),
    clientId: clientId,
    isFetching: clients.isFetching || jobs.isFetching,
    token: auth.token,
    dispatch: ownProps.dispatch,
    push: ownProps.history.push,
    responsive: nav.responsive
  };
};

export default connect(mapStateToProps)(ClientDetailContainer);
