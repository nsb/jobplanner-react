// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Search from "grommet/components/Search";
import Anchor from "grommet/components/Anchor";
import Button from "grommet/components/Button";
import AddIcon from "grommet/components/icons/base/Add";
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import { fetchJobs } from "../actions/jobs";
import JobListItem from "./JobListItem";
import NavControl from "./NavControl";
import { ensureState } from "redux-optimistic-ui";

import type { State as ReduxState } from "../types/State";
import type { Job } from "../actions/jobs";
import type { Business } from "../actions/businesses";
import type { Dispatch } from "../types/Store";

const title = (
  <FormattedMessage
    id="jobs.title"
    description="Jobs title"
    defaultMessage="Jobs"
  />
)

type Props = {
  business: Business,
  dispatch: Dispatch,
  jobs: Array<Job>,
  token: string,
  isFetching: boolean,
  push: Function,
  intl: intlShape
};

type State = {
  searchText: string,
  offset: number,
  limit: number
};

class JobList extends Component<Props, State> {
  state: State = {
    searchText: "",
    offset: 0,
    limit: 15
  };

  componentDidMount() {
    this.onMore();
  }

  render() {
    const { jobs, business, isFetching, totalCount } = this.props;

    const filteredJobs = jobs.filter(job => {
      const searchText = this.state.searchText.toLowerCase();
      if (searchText) {
        return job.description.toLowerCase().includes(searchText);
      } else {
        return true;
      }
    });

    const addControl = (
      <Anchor
        icon={<AddIcon />}
        path={`/${business.id}/jobs/add`}
        a11yTitle={`Add job`}
      />
    );

    return (
      <Box>
        <Header size="large" pad={{ horizontal: "medium" }}>
          <NavControl title={title} />
          <Search
            inline={true}
            fill={true}
            size="medium"
            placeHolder="Search"
            value={this.state.searchText}
            onDOMChange={this.onSearch}
          />
          {addControl}
        </Header>
        <List onMore={isFetching || this.state.offset > totalCount ? undefined : this.onMore}>
          {filteredJobs.map((job, index) => {
            return (
              <JobListItem
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
          unfilteredTotal={isFetching ? null : jobs.length}
          emptyMessage="You do not have any jobs."
          addControl={
            <Button
              icon={<AddIcon />}
              label="Add job"
              primary={true}
              a11yTitle={`Add job`}
              path={`/${business.id}/jobs/add`}
            />
          }
        />
      </Box>
    );
  }

  onMore = () => {
    const { token, dispatch, business } = this.props;
    if(token) {
      dispatch(
        fetchJobs(token, {
          business: business.id,
          ordering: "status_order,next_visit",
          limit: this.state.limit,
          offset: this.state.offset,
          search: this.state.searchText
        })
      );
      this.setState({ offset: this.state.offset + this.state.limit });
    }
  };

  onClick = (e: SyntheticEvent<>, job: Job) => {
    const { push, business } = this.props;
    push(`/${business.id}/jobs/${job.id}`);
  };

  onSearch = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    this.setState({ searchText });
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    businessId: number,
    push: string => void,
  }
): * => {
  const { entities, jobs, auth } = state;

  return {
    business: ensureState(entities).businesses[ownProps.businessId],
    jobs: jobs.result.map(Id => {
      return ensureState(entities).jobs[Id];
    }),
    isFetching: jobs.isFetching,
    token: auth.token,
    push: ownProps.push,
    totalCount: jobs.count
  };
};

export default connect(mapStateToProps)(injectIntl(JobList));
