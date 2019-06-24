// @flow

import React, { Component } from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import moment from "moment";
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
import Timestamp from "grommet/components/Timestamp";
import MoreIcon from "grommet/components/icons/base/More";
import AddIcon from "grommet/components/icons/base/Add";
import LinkPreviousIcon from "grommet/components/icons/base/LinkPrevious";
import Status from "grommet/components/icons/Status";
import { rrulestr } from "rrule";
import JobActions from "../components/JobActions";
import VisitAsyncTask from "../components/VisitAsyncTask";
import VisitAddContainer from "./VisitAddContainer";
import JobClose from "./JobClose";
import JobStatusTag from "./JobStatusTag";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { Client } from "../actions/clients";
import type { Property } from "../actions/properties";
import type { Responsive } from "../actions/nav";

const intlAddress = (
  <FormattedMessage
    id="jobDetail.addressHeading"
    description="Job detail address heading"
    defaultMessage="Address"
  />
);

const intlDetails = (
  <FormattedMessage
    id="jobDetail.detailsHeading"
    description="Job detail details heading"
    defaultMessage="Details"
  />
);

const intlDetailsStarted = (date: Date) => (
  <FormattedMessage
    id="jobDetail.detailsStarted"
    description="Job detail details started"
    defaultMessage="Started on {date}"
    values={{date: <Timestamp value={date} fields="date" />}}
  />
);

const intlDetailsOneOff = (
  <FormattedMessage
    id="jobDetail.detailsOneOff"
    description="Job detail details One-off"
    defaultMessage="One-Off job"
  />
);

const intlContact = (
  <FormattedMessage
    id="jobDetail.contactHeading"
    description="Job detail contact heading"
    defaultMessage="Contact"
  />
);

const intlLineItems = (
  <FormattedMessage
    id="jobDetail.lineItemsHeading"
    description="Job detail lineitems heading"
    defaultMessage="Line items"
  />
);

const intlLineItemsEmptyMessage = (
  <FormattedMessage
    id="jobDetail.lineItemsEmptyMessage"
    description="Job detail lineitems empty message"
    defaultMessage="No line items."
  />
);

const intlVisits = (
  <FormattedMessage
    id="jobDetail.visitsHeading"
    description="Job detail visits heading"
    defaultMessage="Visits"
  />
);

const intlVisitsAdd = (
  <FormattedMessage
    id="jobDetail.visitAdd"
    description="Job detail visit add"
    defaultMessage="Add visit"
  />
);

export type Props = {
  business: Business,
  job: Job,
  client: Client,
  lineItems: Array<Object>,
  jobId: number,
  property: ?Property,
  token: ?string,
  isFetching: boolean,
  push: string => void,
  fetchJob: Function,
  partialUpdateJob: Function,
  deleteJob: Function,
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

  constructor(props: Props) {
    super(props);

    this.dateFormat = moment()
    .creationData()
    .locale.longDateFormat("L");
  this.timeFormat = moment()
    .creationData()
    .locale.longDateFormat("LT");

  }

  componentDidMount() {
    const { job, jobId, token, fetchJob } = this.props;
    if (!job && token) {
      fetchJob(token, jobId);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { job, client, token, fetchClient, resetVisits } = this.props;
    if (!prevProps.job && job && !client && token) {
      fetchClient(token, job.client);
    }

    if (prevProps.job && prevProps.job.closed !== job.closed) {
      // if job status has changed we should reload visits
      resetVisits();
    }

    if (prevProps.job && prevProps.job.incomplete_visit_count && !job.incomplete_visit_count) {
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
      token
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
            {intlAddress}
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
            {intlContact}
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
                  <JobStatusTag status={job.status} />
                </Box>
                {sidebarControl}
              </Header>
              <Article pad="none" align="start" primary={true}>
                <Box full="horizontal">
                  <Section pad="medium" full="horizontal">
                    <Heading tag="h3" margin="none">
                      <strong>{client && (client.is_business ? client.business_name : `${client.first_name} ${client.last_name}`)}</strong>
                    </Heading>
                    {jobDescription} 
                    <Columns masonry={false} maxCount={2}>                      
                      {propertyAddress}
                      {clientDetails}
                      <Box pad={{ horizontal: "none", vertical: "small" }}>
                        <Heading tag="h4" margin="none">
                          {intlDetails}
                        </Heading>
                        {intlDetailsStarted(job.begins)}
                        <br />
                        {job.recurrences ? rrulestr(job.recurrences).toText() : intlDetailsOneOff}
                      </Box>
                    </Columns>
                  </Section>
                  <Section full="horizontal">
                    <Box pad={{ horizontal: "medium", vertical: "none" }}>
                      <Heading tag="h4">{intlLineItems}</Heading>
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
                        emptyMessage={intlLineItemsEmptyMessage}
                      />
                    </Box>
                  </Section>
                  <Section full="horizontal">
                    <Box pad={{ horizontal: "medium", vertical: "none" }}>
                      <Header>
                        <Title>{intlVisits}</Title>
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
                            a11yTitle={intlVisitsAdd}
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

export default injectIntl(JobDetail);
