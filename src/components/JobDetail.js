// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import Split from 'grommet/components/Split';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import MoreIcon from 'grommet/components/icons/base/More';
import LinkPreviousIcon from 'grommet/components/icons/base/LinkPrevious';
import {rrulestr} from 'rrule';
import JobActions from '../components/JobActions';
import VisitListContainer from '../components/VisitListContainer';
import {navResponsive} from '../actions/nav';
import type {Business} from '../actions/businesses';
import type {Job} from '../actions/jobs';
import type {State} from '../types/State';
import type {Dispatch} from '../types/Store';
import type {Responsive} from '../actions/nav';

class JobsDetail extends Component {
  props: {
    token: string,
    business: Business,
    clients: Array<Client>,
    job: Job,
    dispatch: Dispatch,
    responsive: boolean,
    push: (string) => void
  };

  state: {
    showSidebarWhenSingle: boolean
  } = {
    showSidebarWhenSingle: false
  }

  render() {

    const { business, job, responsive } = this.props;

    let onSidebarClose;
    let sidebarControl;

    if ('single' === responsive) {
        sidebarControl = (
          <Button icon={<MoreIcon />} onClick={this._onToggleSidebar} />
        );
        onSidebarClose = this._onToggleSidebar;
    }

    let sidebar;
    sidebar = (
      <JobActions job={job} onClose={onSidebarClose} onEdit={this.onEdit} />
    );

    return (
      <Split flex="left" separator={true}
        priority={this.state.showSidebarWhenSingle ? 'right' : 'left'}
        onResponsive={this.onResponsive}>

        <div>
          <Header pad={{horizontal: "small", vertical: "medium"}}
            justify="between" size="large" colorIndex="light-2">
            <Box direction="row" align="center" pad={{between: 'small'}}
              responsive={false}>
              <Anchor icon={<LinkPreviousIcon />} path={`/${business.id}/jobs`}
                a11yTitle="Return" />
              <Heading tag="h1" margin="none">
                <strong>{`Job ${job.id}`}</strong>
              </Heading>
            </Box>
            {sidebarControl}
          </Header>
          <Article pad="none" align="start" primary={true}>

            <Box full="horizontal">
              <Section pad="medium" full="horizontal">
                <Heading tag="h2" margin="none">{rrulestr(job.recurrences).toText()}</Heading>
              </Section>
              <Section pad="medium" full="horizontal">
                <VisitListContainer job={job} />
              </Section>
            </Box>
          </Article>
        </div>
        {sidebar}

      </Split
      >
    );
  }

  onResponsive = (responsive: Responsive) => {
    this.props.dispatch(navResponsive(responsive));
  };

  onClose = () => {
    const {business, push} = this.props;
    push(`/${business.id}/jobs`);
  };

  _onToggleSidebar = () => {
    this.setState({
      showSidebarWhenSingle: ! this.state.showSidebarWhenSingle
    });
  }

  onEdit = () => {
    const {business, job, push} = this.props;
    push(`/${business.id}/jobs/${job.id}/edit`);
  }

}

const mapStateToProps = (
  state: State,
  ownProps: {
    match: {params: {businessId: number, jobId: number}},
    history: {push: string => void},
  }
) => {
  const {auth, entities, clients, nav} = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const jobId = parseInt(ownProps.match.params.jobId, 10);

  return {
    token: auth.token,
    business: entities.businesses[businessId],
    job: entities.jobs[jobId],
    clients: clients.result.map(Id => {
      return entities.clients[Id];
    }),
    push: ownProps.history.push,
    responsive: nav.responsive
  };
};

export default connect(mapStateToProps)(JobsDetail);
