// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Search from "grommet/components/Search";
import Button from "grommet/components/Button";
import Anchor from "grommet/components/Anchor";
import AddIcon from "grommet/components/icons/base/Add";
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import { AuthContext } from "../providers/authProvider";
import { fetchJobs } from "../actions/jobs";
import JobListItemContainer from "./JobListItemContainer";
import NavControl from "./NavControl";
import { jobsSorted as jobsSelector } from "../selectors/jobSelectors";
import { ensureState } from "redux-optimistic-ui";

import type { State as ReduxState } from "../types/State";
import type { Job } from "../actions/jobs";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";
import type { Responsive } from "../actions/nav";

const intlTitle = (
  <FormattedMessage
    id="jobList.title"
    description="Job list title"
    defaultMessage="Jobs"
  />
)

const intlSearch = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobList.searchPlaceholder"
    description="Job list search placeholder"
    defaultMessage="Search"
  />
)

const intlAdd = (
  <FormattedMessage
    id="jobList.addJob"
    description="Job list add job"
    defaultMessage="Add job"
  />
)

const intlEmptyMessage = (
  <FormattedMessage
    id="jobList.emptyMessage"
    description="Job list empty message"
    defaultMessage="Add a job to get started scheduling work for your clients."
  />
)

type Props = {
  business: Business,
  jobs: Array<Job>,
  isFetching: boolean,
  push: Function,
  fetchJobs: Function,
  totalCount: number,
  responsive: Responsive
};

type State = {
  searchText: string,
  searchResults: Array<number>,
  offset: number,
  limit: number
};

class JobList extends Component<Props & { intl: intlShape }, State> {
  searchTimeout: ?TimeoutID = null;
  state: State = {
    searchText: "",
    searchResults: [],
    offset: 0,
    limit: 15
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.onMore();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.searchText !== this.state.searchText) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.setState({ offset: 0, searchResults: [] }, this.onMore);
      }, 500);
    }
  }

  render() {
    const { jobs, business, isFetching, totalCount, intl, responsive } = this.props;

    const filteredJobs = jobs.filter(job => {
      if (this.state.searchText) {
        return this.state.searchResults.includes(job.id)
      } else {
        return true;
      }
    });

    const search = jobs.length ? (
      <Search
      inline={true}
      fill={true}
      size="medium"
      placeHolder={intl.formatMessage({ id: "jobList.searchPlaceholder" })}
      value={this.state.searchText}
      onDOMChange={this.onSearch}
    />
    ) : undefined

    return (
      <Box>
        <Header size="large" pad={{ horizontal: "medium" }}>
          <NavControl title={intlTitle} />
          {search}
          {
            jobs.length ?
              responsive === "single" ?
                <Anchor
                  icon={<AddIcon />}
                  path={`/${business.id}/jobs/add`}
                  a11yTitle={intlAdd}
                /> : <Button label={intlAdd}
                  accent={true}
                  path={`/${business.id}/jobs/add`} /> : undefined
          }
        </Header>
        <List onMore={isFetching || this.state.offset > totalCount ? undefined : this.onMore}>
          {filteredJobs.map((job, index) => {
            return (
              <JobListItemContainer
                key={job.id}
                job={job}
                index={index}
                onClick={(e: SyntheticEvent<>) => this.onClick(e, job)}
              />
            );
          })}
        </List>
        <ListPlaceholder
          filteredTotal={isFetching ? null : filteredJobs.length}
          unfilteredTotal={isFetching ? null : this.state.searchText ? jobs.length : totalCount}
          emptyMessage={intlEmptyMessage}
          addControl={
            <Button
              icon={<AddIcon />}
              label={intlAdd}
              primary={true}
              a11yTitle={intlAdd}
              path={`/${business.id}/jobs/add`}
            />
          }
        />
      </Box>
    );
  }

  onMore = () => {
    const { business, fetchJobs } = this.props;
    const { getUser } = this.context;
    getUser().then(({ access_token }) => {
      return fetchJobs(access_token, {
        business: business.id,
        ordering: "status_order,next_visit",
        limit: this.state.limit,
        offset: this.state.offset,
        search: this.state.searchText
      })
    }).then((resultJobs) => {
      return this.setState({
        offset: this.state.offset + this.state.limit,
        searchResults: resultJobs.results.map(job => job.id)
      });
    });
  };

  onClick = (e: SyntheticEvent<>, job: Job) => {
    const { push, business } = this.props;
    push(`/${business.id}/jobs/${job.id}`);
  };

  onSearch = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ searchText: event.target.value });
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    businessId: number,
    push: string => void,
  fetchJobs: Function
  }
): * => {
  const { entities, jobs, nav } = state;

  return {
    business: ensureState(entities).businesses[ownProps.businessId],
    jobs: jobsSelector(state),
    isFetching: jobs.isFetching,
    push: ownProps.push,
    totalCount: jobs.count,
    fetchJobs: ownProps.fetchJobs,
    responsive: nav.responsive
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchJobs
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(JobList));
