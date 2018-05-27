// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchVisits } from "../actions/visits";
import VisitsReport from "./VisitsReport";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Business } from "../actions/businesses";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  business: Business,
  visits: Array<Visit>,
  token: ?string,
  isFetching: boolean,
  dispatch: Dispatch,
  totalCount: number
};

type State = {
  searchText: string,
  offset: number,
  limit: number
};

class VisitsReportContainer extends Component<Props, State> {
  state: State = {
    searchText: "",
    offset: 0,
    limit: 30
  };

  componentDidMount() {
    this.onMore();
  }

  componentDidUpdate(prevProps, prevState) {
    const { dispatch } = this.props;

    if (prevState.searchText !== this.state.searchText) {
      dispatch({ type: "RESET_VISITS" });
      this.onMore();
    }
  }

  render() {
    const { business, visits, isFetching, totalCount } = this.props;

    return (
      <VisitsReport
        business={business}
        visits={visits}
        isFetching={isFetching}
        onMore={this.state.offset < totalCount ? this.onMore : null}
        onSearch={this.onSearch}
        searchText={this.state.searchText}
      />
    );
  }

  onMore = () => {
    const { business, token, dispatch } = this.props;
    if (token) {
      dispatch(
        fetchVisits(token, {
          business: business.id,
          ordering: "date",
          limit: this.state.limit,
          offset: this.state.offset,
          search: this.state.searchText
        })
      );
      this.setState({ offset: this.state.offset + this.state.limit });
    }
  };

  onSearch = ({ target }: SyntheticInputEvent<*>) => {
    this.setState({ searchText: target.value, offset: 0 });
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
  const { visits, entities, auth } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: ensureState(entities).businesses[businessId],
    visits: ensureState(visits).result.map((Id: number) => {
      return ensureState(entities).visits[Id];
    }),
    isFetching: visits.isFetching,
    token: auth.token,
    dispatch: ownProps.dispatch,
    totalCount: visits.count
  };
};

export default connect(mapStateToProps)(VisitsReportContainer);
