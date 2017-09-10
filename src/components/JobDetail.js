// @flow

import React, {Component} from 'react';
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
import Toast from 'grommet/components/Toast';
import {rrulestr} from 'rrule';
import JobActions from '../components/JobActions';
import VisitListContainer from '../components/VisitListContainer';
import type {Business} from '../actions/businesses';
import type {Job} from '../actions/jobs';
import type {Responsive} from '../actions/nav';

type Props = {
  business: Business,
  job: Job,
  responsive: Responsive,
  onEdit: Function,
  onResponsive: Function,
  saved: boolean
};

type State = {
  showSidebarWhenSingle: boolean
};

class JobDetail extends Component<Props, State> {
  state = {
    showSidebarWhenSingle: false
  }

  render() {

    const { business, job, responsive, onEdit, onResponsive, saved } = this.props;

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
      <JobActions job={job} onClose={onSidebarClose} onEdit={onEdit} />
    );

    let toast;
    if (saved) {
      toast = (
        <Toast status='ok'
          onClose={undefined}>
          Job successfully saved.
        </Toast>
      );
    };

    return (
      <Split flex="left" separator={true}
        priority={this.state.showSidebarWhenSingle ? 'right' : 'left'}
        onResponsive={onResponsive}>

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
        {toast}
      </Split
      >
    );
  }

  _onToggleSidebar = () => {
    this.setState({
      showSidebarWhenSingle: ! this.state.showSidebarWhenSingle
    });
  }

}

export default JobDetail;
