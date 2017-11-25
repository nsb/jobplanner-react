// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClient } from "../actions/clients";
import { fetchJobs } from "../actions/jobs";
import { navResponsive } from "../actions/nav";
import ClientDetail from "./ClientDetail";
import type { Props } from "./ClientDetail";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number, clientId: number } },
    history: { push: Function },
    fetchClient: Function,
    fetchJobs: Function,
    navResponsive: Function
  }
): Props => {
  const { clients, jobs, entities, auth, nav } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const clientId = parseInt(ownProps.match.params.clientId, 10);
  const client = ensureState(entities).clients[clientId];

  return {
    business: ensureState(entities).businesses[businessId],
    client: client,
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
    push: ownProps.history.push,
    responsive: nav.responsive,
    fetchClient: ownProps.fetchClient,
    fetchJobs: ownProps.fetchJobs,
    navResponsive: ownProps.navResponsive
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchClient,
      fetchJobs,
      navResponsive
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ClientDetail);
