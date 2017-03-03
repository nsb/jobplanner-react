import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Box from 'grommet/components/Box'
import Header from 'grommet/components/Header'
import Title from 'grommet/components/Title'
import Search from 'grommet/components/Search'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import AddIcon from 'grommet/components/icons/base/Add'
import List from 'grommet/components/List'
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder'
import { fetchJobs } from '../actions'
import JobListItem from './JobListItem'
import NavControl from './NavControl'

class Jobs extends Component {

  static propTypes = {}

  componentDidMount () {
    const { business, jobs, token, dispatch } = this.props
    if (!jobs.length) {
      dispatch(fetchJobs(token, {business: business.id}))
    }
  }

  render () {
    const { jobs, business, isFetching } = this.props

    const addControl = (
        <Anchor icon={<AddIcon />} path={`/${business.id}/jobs/add`}
          a11yTitle={`Add job`} onClick={this.handleAdd} />
      )

    return (
      <Box>
        <Header size='large' pad={{ horizontal: 'medium' }}>
          <Title responsive={false}>
            <NavControl />
            <span>Jobs</span>
          </Title>
          <Search inline={true} fill={true} size='medium' placeHolder='Search'
            value={this.searchText} onDOMChange={this.onSearch} />
          {addControl}
        </Header>
        <List onMore={null}>
          {jobs.map((job, index) => {
            return <JobListItem key={job.id}
              job={job} index={index} onClick={e => this.onClick(e, job)} />
          })}
        </List>
        <ListPlaceholder filteredTotal={isFetching ? null : jobs.length}
          unfilteredTotal={jobs.length}
          emptyMessage='You do not have any jobs.'
          addControl={
            <Button icon={<AddIcon />} label='Add job'
              primary={true} a11yTitle={`Add job`}
              onClick={this.handleAdd} />
            } />
      </Box>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { businesses, jobs, auth } = state
  const businessId = parseInt(ownProps.params.businessId, 10)

  return {
    business: businesses.entities.businesses[businessId],
    jobs: jobs.result.map((Id) => {
      return jobs.entities.jobs[Id]
    }),
    isFetching: jobs.isFetching,
    token: auth.token
  }
}

export default connect(mapStateToProps)(Jobs)
