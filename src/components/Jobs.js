// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Search from 'grommet/components/Search';
import Anchor from 'grommet/components/Anchor';
import Button from 'grommet/components/Button';
import AddIcon from 'grommet/components/icons/base/Add';
import List from 'grommet/components/List';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';
import {fetchJobs} from '../actions/jobs';
import JobListItem from './JobListItem';
import NavControl from './NavControl';
import type {State} from '../types/State';

class Jobs extends Component {
  state: {
    searchText: string
  }

  constructor() {
    super();
    this.state = {searchText: ''};
  }

  componentDidMount() {
    const {business, jobs, token, dispatch} = this.props;
    if (!jobs.length) {
      dispatch(fetchJobs(token, {business: business.id}));
    }
  }

  render() {
    const {jobs, business, isFetching} = this.props;

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
        // onClick={this.handleAdd}
      />
    );

    return (
      <Box>
        <Header size="large" pad={{horizontal: 'medium'}}>
          <Title responsive={false}>
            <NavControl />
            <span>Jobs</span>
          </Title>
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
        <List onMore={isFetching ? this.onMore : undefined}>
          {filteredJobs.map((job, index) => {
            return (
              <JobListItem
                key={job.id}
                job={job}
                index={index}
                onClick={e => this.onClick(e, job)}
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
              // onClick={this.handleAdd}
            />
          }
        />
      </Box>
    );
  }

  onMore = () => {};

  onClick = (e, job) => {
    const {business, dispatch} = this.props;
    dispatch(push(`/${business.id}/jobs/${job.id}`));
  };

  onSearch = event => {
    const searchText = event.target.value;
    this.setState({searchText});
  };
}

const mapStateToProps = (state: State, ownProps: {params: {businessId: number}}) => {
  const {businesses, jobs, auth} = state;
  const businessId = parseInt(ownProps.params.businessId, 10);

  return {
    business: businesses.entities.businesses[businessId],
    jobs: jobs.result.map(Id => {
      return jobs.entities.jobs[Id];
    }),
    isFetching: jobs.isFetching,
    token: auth.token,
  };
};

export default connect(mapStateToProps)(Jobs);
