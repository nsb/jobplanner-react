// @flow

import React, { Component } from "react";
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
    return (
      <ListItem
        direction="row"
        align="center"
        justify="between"
        separator={index === 0 ? "horizontal" : "bottom"}
        pad={{ horizontal: "medium", vertical: "small", between: "medium" }}
        responsive={false}
        onClick={onClick}
        selected={false}
      >
        <span>
          <Status
            value={job.closed ? "disabled" : "ok"}
            a11yTitle={job.closed ? "Closed" : "Open"}
          />{" "}
          Job #{job.id}
        </span>
        <span>
          <Timestamp value={job.begins} fields="date" /> -{" "}
          <Timestamp value={job.ends} fields="date" />
        </span>
      </ListItem>
    );
  }
}

export default JobListItem;
