// @flow

import React, { Component } from "react";
import Box from "grommet/components/Box";
import ListItem from "grommet/components/ListItem";
import Timestamp from "grommet/components/Timestamp";
import Status from "grommet/components/icons/Status";
import JobStatusTag from "./JobStatusTag";
import type { Job } from "../actions/jobs";
import type { Client } from "../actions/clients";

export type Props = {
  job: Job,
  client?: Client,
  index: number,
  onClick: Function
};

class JobListItem extends Component<Props> {
  render() {
    const { job, client, index, onClick } = this.props;

    let jobDescription;
    if (job.description) {
      if (job.description.length > 17) {
        jobDescription = `Job #${job.id} - ${job.description.substr(0, 17)}…`
      } else {
        jobDescription = `Job #${job.id} - ${job.description}`
      }
    } else {
      jobDescription = `Job #${job.id}`;
    }

    let dates;
    if (job.ends) {
      dates = (<span>
        <Timestamp value={job.begins} fields="date" /> -{" "}
        <Timestamp value={job.ends} fields="date" />
      </span>)
    } else {
      dates = <Timestamp value={job.begins} fields="date" />
    }

    return (
      <ListItem
        direction="row"
        align="start"
        justify="between"
        separator={index === 0 ? "horizontal" : "bottom"}
        pad={{ horizontal: "medium", vertical: "small", between: "medium" }}
        responsive={true}
        onClick={onClick}
        selected={false}
      >
        <span>
          <Box>
            <div>
              <Status
                value={job.closed ? "disabled" : "ok"}
                a11yTitle={job.closed ? "Closed" : "Open"}
              />{" "}
              {jobDescription}
            </div>
            <JobStatusTag status={job.status} />
          </Box>
        </span>
        <span>{client && (client.is_business ? client.business_name : `${client.first_name} ${client.last_name}`)}</span>
        {dates}
      </ListItem>
    );
  }
}

export default JobListItem;
