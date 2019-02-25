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
import Title from "grommet/components/Title";
import Columns from "grommet/components/Columns";
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import ListItem from "grommet/components/ListItem";
import Spinning from "grommet/components/icons/Spinning";
import MoreIcon from "grommet/components/icons/base/More";
import AddIcon from "grommet/components/icons/base/Add";
import LinkPreviousIcon from "grommet/components/icons/base/LinkPrevious";
import Status from "grommet/components/icons/Status";
import { rrulestr } from "rrule";
import NavControl from './NavControl';
import JobActions from "../components/JobActions";
import VisitAsyncTask from "../components/VisitAsyncTask";
import VisitAddContainer from "./VisitAddContainer";
import JobClose from "./JobClose";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { Client } from "../actions/clients";
import type { Property } from "../actions/properties";
import type { Responsive } from "../actions/nav";

export type Props = {
  business: Business,
  job: Job,
  client: ?Client,
  lineItems: Array<Object>,
  jobId: number,
  property: ?Property,
  token: ?string,
  isFetching: boolean,
  push: string => void,
  fetchJob: Function,
  partialUpdateJob: Function,
  deleteJob: Function,
  fetchClient: Function,
  resetVisits: Function,
  responsive: Responsive
};

type State = {
  showSidebarWhenSingle: boolean,
  showAddVisit: boolean,
  showJobClose: boolean
};

class JobDetail extends Component<Props & { intl: intlShape }, State> {
  state = {
    showSidebarWhenSingle: false,
    showAddVisit: false,
    showJobClose: false
  };

  componentDidMount() {
    const { job, client, jobId, token, fetchJob, fetchClient } = this.props;
    if (!job && token) {
      fetchJob(token, jobId);
    } else if (job && !client && token) {
      fetchClient(token, job.client);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { job, client, token, fetchClient, resetVisits } = this.props;
    if (!prevProps.job && job && !client && token) {
      fetchClient(token, job.client);
    }

    if (prevProps.job.closed !== job.closed) {
      // if job status has changed we should reload visits
      resetVisits();
    }

    if (prevProps.job.incomplete_visit_count && !job.incomplete_visit_count) {
      // if job has no incomplete visits ask to close job
      this.setState({showJobClose: true})
    }
  }

  render() {
    const {
      business,
      job,
      client,
      lineItems,
      property,
      responsive,
      isFetching,
      token,
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

    let jobDescription;
    if (job && job.description) {
      jobDescription = (
        <Box pad={{ horizontal: "none", vertical: "small" }}>
          {job.description}
        </Box>
      );
    }

    let propertyAddress;
    if (property) {
      propertyAddress = (
        <Box pad={{ horizontal: "none", vertical: "small" }}>
          <Heading tag="h4" margin="none">
            Address
          </Heading>
          <div>{property.address1}</div>
          {property.address2}
        </Box>
      );
    }

    let clientDetails;
    if (client) {
      clientDetails = (
        <Box pad={{ horizontal: "none", vertical: "small" }}>
          <Heading tag="h4" margin="none">
            Contact
          </Heading>
          <div>{client.phone}</div>
          {client.email}
        </Box>
      );
    }

    let visitAddLayer;
    if (this.state.showAddVisit) {
      visitAddLayer = (
        <VisitAddContainer
          business={business}
          job={job}
          onClose={this.onCloseAddVisit}
        />
      );
    }

    let jobCloseLayer;
    if (this.state.showJobClose) {
      jobCloseLayer = (
        <JobClose
          job={job}
          onClose={() => {this.setState({showJobClose: false})}}
          token={token}
        />
      )
    }

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
        <div>
          <Split
            flex="left"
            separator={true}
            priority={this.state.showSidebarWhenSingle ? "right" : "left"}
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
                  <NavControl />
                  <Anchor
                    icon={<LinkPreviousIcon />}
                    path={`/${business.id}/clients/${job.client}`}
                    a11yTitle="Return"
                  />

                  <Heading tag="h4" margin="none">
                    <Status
                      value={job.closed ? "disabled" : "ok"}
                      a11yTitle={job.closed ? "Closed" : "Open"}
                    />{" "}
                    <strong>Job #{job.id}</strong>
                  </Heading>
                </Box>
                {sidebarControl}
              </Header>
              <Article pad="none" align="start" primary={true}>
                <Box full="horizontal">
                  <Section pad="medium" full="horizontal">
                    <Heading tag="h3" margin="none">
                      <strong>{`${job.client_firstname} ${job.client_lastname}`}</strong>
                    </Heading>
                    {jobDescription} 
                    <Columns masonry={false} maxCount={2}>                      
                      {propertyAddress}
                      {clientDetails}
                      <Box pad={{ horizontal: "none", vertical: "small" }}>
                        <Heading tag="h4" margin="none">
                          Details
                        </Heading>
                        {`Job #${job.id}`}
                        <br />
                        {job.recurrences ? rrulestr(job.recurrences).toText() : "One-Off job"}
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
                            responsive={true}
                            onClick={undefined}
                            selected={false}
                            key={line_item.id}
                          >
                            <span>{line_item.name}</span>
                            <span>{line_item.quantity}</span>
                            <span>{line_item.unit_cost}</span>
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
                      <Header>
                        <Title>Visits</Title>
                        <Box
                          flex={true}
                          justify="end"
                          direction="row"
                          responsive={false}
                        >
                          <Anchor
                            icon={<AddIcon />}
                            onClick={() =>
                              this.setState({ showAddVisit: true })
                            }
                            a11yTitle="New job"
                          />
                        </Box>
                      </Header>
                    </Box>
                    <VisitAsyncTask job={job} business={business} />
                  </Section>
                </Box>
              </Article>
            </div>
            {sidebar}
          </Split>
          {visitAddLayer}
          {jobCloseLayer}
        </div>
      );
    }
  }

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

  onCloseAddVisit = () => {
    this.setState({ showAddVisit: false });
  };
}

export default JobDetail;
