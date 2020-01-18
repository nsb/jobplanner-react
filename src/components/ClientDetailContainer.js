// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClient } from "../actions/clients";
import { fetchJobs } from "../actions/jobs";
import ClientDetail from "./ClientDetail";
import type { Props } from "./ClientDetail";
import { jobsSorted as jobsSelector } from "../selectors/jobSelectors";
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
  const { clients, jobs, entities } = state;
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
    jobs: jobsSelector(state).filter(job => job.client === clientId),
    clientId: clientId,
    isFetching: clients.isFetching || jobs.isFetching,
    push: ownProps.history.push,
    fetchClient: ownProps.fetchClient,
    fetchJobs: ownProps.fetchJobs,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchClient,
      fetchJobs
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ClientDetail);
