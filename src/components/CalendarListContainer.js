// @flow

import { connect } from "react-redux";
import { ensureState } from "redux-optimistic-ui";
import type { State as ReduxState } from "../types/State";
import CalendarList from "./CalendarList";
import type { Business } from "../actions/businesses";

type Props = {
  business: Business
};

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number } }
  }
): Props => {
  const { entities } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: ensureState(entities).businesses[businessId]
  };
};

export default connect(mapStateToProps)(CalendarList);
