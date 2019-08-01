// @flow

import { connect } from "react-redux";
import JobListItem from "./JobListItem";
import { getClientById } from "../selectors/clientSelectors";
import type { State as ReduxState } from "../types/State";
import type { Job } from "../actions/jobs";
import type { Props } from "./JobListItem";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    job: Job,
    onClick: Function,
    index: number
  }
): Props => {
  return {
    index: ownProps.index,
    job: ownProps.job,
    onClick: ownProps.onClick,
    client: getClientById(state, {id: ownProps.job.client })
  };
};

export default connect(mapStateToProps)(JobListItem);
