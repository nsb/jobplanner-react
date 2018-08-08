// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchVisits } from "../actions/visits";
import VisitsReport from "./VisitsReport";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Business } from "../actions/businesses";
import type { Employee } from "../actions/employees";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  business: Business,
  token: ?string,
  employees: Array<Employee>
};

type State = {
  searchText: string,
};

class VisitsReportContainer extends Component<Props, State> {
  state: State = {
    searchText: ""
  };

  componentDidUpdate(prevProps, prevState) {
    const { dispatch } = this.props;

    if (prevState.searchText !== this.state.searchText) {
      dispatch({ type: "RESET_VISITS" });
      this.onMore();
    }
  }

  render() {
    const { business, employees, token } = this.props;

    return (
      <VisitsReport
        business={business}
        onSearch={this.onSearch}
        searchText={this.state.searchText}
        employees={employees}
        token={token}
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
  const { entities, employees, auth } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: ensureState(entities).businesses[businessId],
    token: auth.token,
    employees: employees.result
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .filter(employee => {
        return employee.businesses.indexOf(businessId) > -1 ? employee : false;
      }),
  };
};

export default connect(mapStateToProps)(VisitsReportContainer);
