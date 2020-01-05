// @flow

import React, { Component } from "react";
import { injectIntl, FormattedMessage, intlShape } from "react-intl";
import { addError } from "redux-flash-messages";
import Split from "grommet/components/Split";
import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Article from "grommet/components/Article";
import Anchor from "grommet/components/Anchor";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Title from "grommet/components/Title";
import Section from "grommet/components/Section";
import Columns from "grommet/components/Columns";
import MoreIcon from "grommet/components/icons/base/More";
import AddIcon from "grommet/components/icons/base/Add";
import LinkPreviousIcon from "grommet/components/icons/base/LinkPrevious";
import Spinning from "grommet/components/icons/Spinning";
import ClientActions from "./ClientActions";
import ClientEdit from "./ClientEdit";
import ClientInvoice from "./ClientInvoice";
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import JobListItem from "./JobListItem";
import type { Business } from "../actions/businesses";
import type { Client } from "../actions/clients";
import type { Property } from "../actions/properties";
import type { Job } from "../actions/jobs";
import type { Responsive } from "../actions/nav";

const intlContactHeading = (
  <FormattedMessage
    id="clientDetail.contact"
    description="Client detail contact heading"
    defaultMessage="Contact"
  />
);

const intlPropertiesHeading = (
  <FormattedMessage
    id="clientDetail.propertiesHeading"
    description="Client detail properties heading"
    defaultMessage="Properties"
  />
);

const intlJobsEmptyMessage = (
  <FormattedMessage
    id="clientDetail.jobsEmptyMessage"
    description="Client detail jobs empty message"
    defaultMessage="Schedule work for this client by adding a job."
  />
);

const intlJobAdd = (
  <FormattedMessage
    id="clientDetail.jobAdd"
    description="Client detail job add"
    defaultMessage="Add job"
  />
);

const intlJobTitle = (
  <FormattedMessage
    id="clientDetail.jobTitle"
    description="Client detail job title"
    defaultMessage="Jobs"
  />
);

export type Props = {
  business: Business,
  client: Client,
  properties: Array<Property>,
  jobs: Array<Job>,
  clientId: number,
  token: ?string,
  isFetching: boolean,
  push: string => void,
  responsive: Responsive,
  fetchClient: Function,
  fetchJobs: Function
};

type State = {
  showSidebarWhenSingle: boolean,
  view: "edit" | "invoice" | null
};

class ClientDetail extends Component<Props & { intl: intlShape }, State> {
  state = {
    showSidebarWhenSingle: false,
    view: null
  };

  componentDidMount() {
    const {
      client,
      clientId,
      token,
      fetchClient,
      fetchJobs,
      intl
    } = this.props;
    if (!client && token) {
      fetchClient(token, clientId).catch(() => {
        addError({ text: intl.formatMessage({ id: "flash.error" }) });
      });
    }
    if (token) {
      fetchJobs(token, { client: clientId, ordering: "status_order,-begins" });
    }
  }

  render() {
    const {
      business,
      client,
      properties,
      jobs,
      responsive,
      isFetching
    } = this.props;

    const { view } = this.state;

    let onSidebarClose;
    let sidebarControl;

    if (view === "edit") {
      return <ClientEdit client={client} onClose={this.onClose} />;
    }

    if (view === "invoice") {
      return <ClientInvoice client={client} onClose={this.onClose} />;
    }

    if ("single" === responsive) {
      sidebarControl = (
        <Button icon={<MoreIcon />} onClick={this._onToggleSidebar} />
      );
      onSidebarClose = this._onToggleSidebar;
    }

    let sidebar;
    sidebar = (
      <ClientActions
        client={client}
        onClose={onSidebarClose}
        onEdit={this.onEdit}
        onInvoice={this.onInvoice}
      />
    );

    let billingAddress;
    if (!isFetching && !client.address_use_property) {
      billingAddress = (
        <Section pad="medium" full="horizontal">
          <Heading tag="h4" margin="none">
            Address
          </Heading>
          <Columns>
            <Box margin={{ horizontal: "none", vertical: "small" }}>
              <div>{client.address1}</div>
              <div>{client.address2}</div>
              <div>
                {client.zip_code} {client.city}
              </div>

              <div>{client.country}</div>
            </Box>
          </Columns>
        </Section>
      );
    }

    if (isFetching) {
      return (
        <Article scrollStep={true} controls={true}>
          <Section
            full={true}
            colorIndex="dark"
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
                  path={`/${business.id}/clients`}
                  a11yTitle="Return"
                />
                <Heading tag="h3" margin="none">
                  <strong>
                    {client.is_business
                      ? client.business_name
                      : `${client.first_name} ${client.last_name}`}
                  </strong>
                </Heading>
              </Box>
              {sidebarControl}
            </Header>
            <Article pad="none" align="start" primary={true}>
              <Section pad="medium" full="horizontal">
                <Heading tag="h4" margin="none">
                  {intlContactHeading}
                </Heading>
                <Columns>
                  <Box margin={{ horizontal: "none", vertical: "small" }}>
                    <div>{client.phone}</div>
                    <div>
                      <Anchor path={`mailto:${client.email}`}>
                        {client.email}
                      </Anchor>
                    </div>
                  </Box>
                </Columns>
              </Section>
              {billingAddress}
              <Section pad="medium" full="horizontal">
                <Heading tag="h4" margin="none">
                  {intlPropertiesHeading}
                </Heading>
                <Columns>
                  {properties.map((property: Property, index: number) => {
                    return (
                      <Box
                        margin={{ horizontal: "none", vertical: "small" }}
                        key={index}
                      >
                        <div>{property.address1}</div>
                        <div>{property.address2}</div>
                        <div>
                          {property.zip_code} {property.city}
                        </div>
                        <div>{property.country}</div>
                      </Box>
                    );
                  })}
                </Columns>
              </Section>

              <Section full="horizontal">
                <Box pad={{ horizontal: "medium", vertical: "none" }}>
                  <Header>
                    <Title>{intlJobTitle}</Title>
                    <Box
                      flex={true}
                      justify="end"
                      direction="row"
                      responsive={false}
                    >
                      {jobs.length ? (
                        responsive === "single" ? (
                          <Anchor
                            icon={<AddIcon />}
                            path={`/${business.id}/jobs/add?client=${client.id}`}
                            a11yTitle={intlJobAdd}
                          />
                        ) : (
                          <Button
                            label={intlJobAdd}
                            accent={true}
                            path={`/${business.id}/jobs/add?client=${client.id}`}
                          />
                        )
                      ) : (
                        undefined
                      )}
                    </Box>
                  </Header>
                </Box>
                <List>
                  {jobs.map((job, index) => {
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
                  filteredTotal={jobs.length}
                  unfilteredTotal={jobs.length}
                  emptyMessage={intlJobsEmptyMessage}
                  addControl={
                    <Button
                      icon={<AddIcon />}
                      label={intlJobAdd}
                      primary={true}
                      a11yTitle={intlJobAdd}
                      path={`/${business.id}/jobs/add?client=${client.id}`}
                    />
                  }
                />
              </Section>
            </Article>
          </div>
          {sidebar}
        </Split>
      );
    }
  }

  onClose = () => {
    this.setState({ view: null });
  };

  onEdit = () => {
    this.setState({ view: "edit" });
  };

  onInvoice = () => {
    this.setState({ view: "invoice" });
  };

  onClick = (e: SyntheticEvent<>, job: Job) => {
    const { push, business } = this.props;
    push(`/${business.id}/jobs/${job.id}`);
  };

  _onToggleSidebar = () => {
    this.setState({
      showSidebarWhenSingle: !this.state.showSidebarWhenSingle
    });
  };
}

export default injectIntl(injectIntl(ClientDetail));
