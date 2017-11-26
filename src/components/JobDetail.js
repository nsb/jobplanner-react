// @flow

import React, { Component } from "react";
import { intlShape } from "react-intl";
import Split from "grommet/components/Split";
import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Article from "grommet/components/Article";
import Anchor from "grommet/components/Anchor";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Section from "grommet/components/Section";
import Columns from "grommet/components/Columns";
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import ListItem from "grommet/components/ListItem";
import Spinning from "grommet/components/icons/Spinning";
import MoreIcon from "grommet/components/icons/base/More";
import LinkPreviousIcon from "grommet/components/icons/base/LinkPrevious";
import { rrulestr } from "rrule";
import JobActions from "../components/JobActions";
import VisitAsyncTask from "../components/VisitAsyncTask";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { Property } from "../actions/properties";
import type { Responsive } from "../actions/nav";

export type Props = {
  business: Business,
  job: Job,
  lineItems: Array<Object>,
  jobId: number,
  property: Property,
  token: string,
  isFetching: boolean,
  push: string => void,
  responsive: Responsive,
  fetchJob: Function,
  partialUpdateJob: Function,
  deleteJob: Function,
  navResponsive: Function
};

type State = {
  showSidebarWhenSingle: boolean
};

class JobDetail extends Component<Props & { intl: intlShape }, State> {
  state = {
    showSidebarWhenSingle: false
  };

  componentDidMount() {
    const { job, jobId, token, fetchJob } = this.props;
    if (!job && token) {
      fetchJob(token, jobId);
    }
  }

  render() {
    const {
      business,
      job,
      lineItems,
      property,
      responsive,
      isFetching,
      intl
    } = this.props;

    let onSidebarClose;
    let sidebarControl;

    if ("single" === responsive) {
      sidebarControl = (
        <Button icon={<MoreIcon />} onClick={this._onToggleSidebar} />
      );
      onSidebarClose = this._onToggleSidebar;
    }

    let sidebar;
    sidebar = (
      <JobActions
        job={job}
        onClose={onSidebarClose}
        onEdit={this.onEdit}
        onToggleCloseJob={this.onToggleCloseJob}
        onRemove={this.onRemove}
      />
    );

    if (isFetching) {
      return (
        <Article scrollStep={true} controls={true}>
          <Section
            full={true}
            colorIndex="dark"
            // texture="url(img/ferret_background.png)"
            pad="large"
            justify="center"
            align="center"
          >
            <Spinning />
          </Section>
        </Article>
      );
    } else {
      return (
        <Split
          flex="left"
          separator={true}
          priority={this.state.showSidebarWhenSingle ? "right" : "left"}
          onResponsive={this.onResponsive}
        >
          <div>
            <Header
              pad={{ horizontal: "small", vertical: "medium" }}
              justify="between"
              size="large"
              colorIndex="light-2"
            >
              <Box
                direction="row"
                align="center"
                pad={{ between: "small" }}
                responsive={false}
              >
                <Anchor
                  icon={<LinkPreviousIcon />}
                  path={`/${business.id}/clients/${job.client}`}
                  a11yTitle="Return"
                />

                <Heading tag="h3" margin="none">
                  <strong>Job #{job.id}</strong>
                </Heading>
              </Box>
              {sidebarControl}
            </Header>
            <Article pad="none" align="start" primary={true}>
              <Box full="horizontal">
                <Section pad="medium" full="horizontal">
                  {`${job.client_firstname} ${job.client_lastname}`}
                  <Columns masonry={false} maxCount={2}>
                    <Box pad={{ horizontal: "none", vertical: "small" }}>
                      <Heading tag="h4" margin="none">
                        Property address
                      </Heading>
                      {property.address1}
                      <br />
                      {property.address2}
                    </Box>
                    <Box pad={{ horizontal: "none", vertical: "small" }}>
                      <Heading tag="h4" margin="none">
                        Contact details
                      </Heading>
                      61 67 15 14
                      <br />
                    </Box>
                    <Box pad={{ horizontal: "none", vertical: "small" }}>
                      <Heading tag="h4" margin="none">
                        Job details
                      </Heading>
                      {`Job #${job.id}`}
                      <br />
                      {rrulestr(job.recurrences).toText()}
                    </Box>
                  </Columns>
                </Section>
                <Section full="horizontal">
                  <Box pad={{ horizontal: "medium", vertical: "none" }}>
                    <Heading tag="h4">Line items</Heading>
                  </Box>
                  <Box>
                    <List onMore={undefined}>
                      {lineItems.map((line_item, index) => (
                        <ListItem
                          direction="row"
                          align="center"
                          justify="between"
                          separator={index === 0 ? "horizontal" : "bottom"}
                          pad={{
                            horizontal: "medium",
                            vertical: "small",
                            between: "medium"
                          }}
                          responsive={false}
                          onClick={undefined}
                          selected={false}
                        >
                          {line_item.name} {index}
                        </ListItem>
                      ))}
                    </List>
                    <ListPlaceholder
                      filteredTotal={lineItems.length}
                      unfilteredTotal={lineItems.length}
                      emptyMessage={intl.formatMessage({
                        id: "lineItems.emptyMessage",
                        defaultMessage: "No line items."
                      })}
                    />
                  </Box>
                </Section>
                <Section full="horizontal">
                  <Box pad={{ horizontal: "medium", vertical: "none" }}>
                    <Heading tag="h4">Visits</Heading>
                  </Box>
                  <VisitAsyncTask job={job} />
                </Section>
              </Box>
            </Article>
          </div>
          {sidebar}
        </Split>
      );
    }
  }

  onResponsive = (responsive: Responsive) => {
    this.props.navResponsive(responsive);
  };

  onClose = () => {
    const { business, push } = this.props;
    push(`/${business.id}/jobs`);
  };

  onToggleCloseJob = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { job, token, partialUpdateJob } = this.props;
    partialUpdateJob({ id: job.id, closed: !job.closed }, token || "");
    e.preventDefault();
  };

  onEdit = () => {
    const { business, job, push } = this.props;
    push(`/${business.id}/jobs/${job.id}/edit`);
  };

  onRemove = () => {
    const { job, token, deleteJob } = this.props;
    deleteJob(job, token);
  };

  _onToggleSidebar = () => {
    this.setState({
      showSidebarWhenSingle: !this.state.showSidebarWhenSingle
    });
  };
}

export default JobDetail;
