// @flow
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchClients } from "../actions/clients";
import ClientList from "./ClientList";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Props } from "./ClientList";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number } },
    history: { push: Function },
    fetchClients: (string, Object) => Promise<any>
  }
): Props => {
  const { clients, entities, nav } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: ensureState(entities).businesses[businessId],
    clients: clients.result.map((Id: number) => {
      return ensureState(entities).clients[Id];
    }),
    isFetching: clients.isFetching,
    push: ownProps.history.push,
    totalCount: clients.count,
    fetchClients: ownProps.fetchClients,
    responsive: nav.responsive
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchClients
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ClientList);
