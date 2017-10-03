// @flow

import React, { Component } from "react";
import Split from "grommet/components/Split";
import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Article from "grommet/components/Article";
import Anchor from "grommet/components/Anchor";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Section from "grommet/components/Section";
import Columns from "grommet/components/Columns";
import MoreIcon from "grommet/components/icons/base/More";
import LinkPreviousIcon from "grommet/components/icons/base/LinkPrevious";
import { rrulestr } from "rrule";
import JobActions from "../components/JobActions";
import VisitListContainer from "../components/VisitListContainer";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { Property } from "../actions/properties";
import type { Responsive } from "../actions/nav";

type Props = {
  business: Business,
  job: Job,
  property: Property,
  responsive: Responsive,
  onEdit: Function,
  onRemove: Function,
  onToggleCloseJob: Function,
  onResponsive: Function,
  saved: boolean
};

type State = {
  showSidebarWhenSingle: boolean
};

class JobDetail extends Component<Props, State> {
  state = {
    showSidebarWhenSingle: false
  };

  render() {
    const {
      business,
      job,
      property,
      responsive,
      onEdit,
      onRemove,
      onResponsive,
      onToggleCloseJob
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
        onEdit={onEdit}
        onToggleCloseJob={onToggleCloseJob}
        onRemove={onRemove}
      />
    );

    return (
      <Split
        flex="left"
        separator={true}
        priority={this.state.showSidebarWhenSingle ? "right" : "left"}
        onResponsive={onResponsive}
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
                path={`/${business.id}/jobs`}
                a11yTitle="Return"
              />

              <Heading tag="h3" margin="none">
                <strong>
                  {`${job.client_firstname} ${job.client_lastname}`}
                </strong>
              </Heading>
            </Box>
            {sidebarControl}
          </Header>
          <Article pad="none" align="start" primary={true}>

            <Box full="horizontal">
              <Section pad="medium" full="horizontal">
                <Heading tag="h4" margin="none">
                  <Box>
                    {`Job #${job.id}`}
                  </Box>
                  {rrulestr(job.recurrences).toText()}
                </Heading>
              </Section>

              <Section pad="medium" full="horizontal">
                <Columns masonry={false} maxCount={2}>
                  <Box>
                    <Heading tag="h4" margin="none">
                      Property address
                    </Heading>
                    {property.address1}<br />
                    {property.address2}<br />
                  </Box>
                  <Box>
                    <Heading tag="h4" margin="none">
                      Contact details
                    </Heading>
                    61 67 15 14
                  </Box>
                </Columns>
              </Section>
              <Section full="horizontal">
                <Box pad={{ horizontal: "medium", vertial: "none" }}>
                  <Heading tag="h4">
                    Visits
                  </Heading>
                </Box>
                <VisitListContainer job={job} />
              </Section>
            </Box>
          </Article>
        </div>
        {sidebar}
      </Split>
    );
  }

  _onToggleSidebar = () => {
    this.setState({
      showSidebarWhenSingle: !this.state.showSidebarWhenSingle
    });
  };
}

export default JobDetail;
