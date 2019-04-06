// @flow

import React, { Component } from "react";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import ListItem from "grommet/components/ListItem";
import Timestamp from "grommet/components/Timestamp";
import Status from "grommet/components/icons/Status";
import type { Job } from "../actions/jobs";

type Props = {
  job: Job,
  index: number,
  onClick: Function
};

class JobListItem extends Component<Props> {
  render() {
    const { job, index, onClick } = this.props;

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

    let has_late_visit;
    if (job.has_late_visit) {
      has_late_visit = (
        <Box
          alignContent="start"
          alignSelf="start"
          margin={{vertical: "small"}}
          pad="none"
          colorIndex="accent-2"
        >
          <Heading
            tag="h6"
            uppercase={true}
            truncate={true}
            margin="none"
          >
            HAS A LATE VISIT
          </Heading>
        </Box>
      )
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
            {has_late_visit}
          </Box>
        </span>
        {dates}
      </ListItem>
    );
  }
}

export default JobListItem;
