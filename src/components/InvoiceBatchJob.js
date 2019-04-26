// @flow

import React, { Component } from 'react';
import Box from "grommet/components/Box";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import CheckBox from 'grommet/components/CheckBox';
import InvoiceBatchVisitContainer from "./InvoiceBatchVisitContainer";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";
import type { VisitSelection } from "./InvoiceBatchVisit";

export type JobSelection = {
  [key: string]: { selected: boolean, visits: VisitSelection }
}

export type Props = {
  job: Job,
  visits: Array<Visit>,
  selected: JobSelection,
  onChange: (JobSelection) => void
};

class InvoiceBatchClient extends Component<Props> {

  render() {
    const { job, visits, selected } = this.props;

    return (
      <ListItem
        direction="column"
        align="start"
        separator="none"
        // colorIndex="accent-1"
      >
        <Box full="horizontal">
          <Box direction="row">
            <CheckBox
              checked={selected[job.id.toString()].selected}
              onChange={this.onJobChanged} />
            #{job.id} - {job.recurrences ? 'Recurring job' : 'One-off job'}
          </Box>
          <List onMore={undefined}>
            {(selected[job.id.toString()].selected ? visits : []).map((visit, index) => {
              return (
                <InvoiceBatchVisitContainer
                  visit={visit}
                  key={index}
                  selected={{ [visit.id]: selected[job.id.toString()].visits[visit.id.toString()] }}
                  onChange={this.onVisitChanged}
                />
              )
            })}
          </List>
        </Box>
      </ListItem>
    )
  }

  onJobChanged = () => {
    const { onChange, job, selected } = this.props;

    onChange({
      [job.id]: {
        ...selected[job.id.toString()],
        ...{ selected: !selected[job.id.toString()].selected}
      }
    });
  }

  onVisitChanged = (selection: VisitSelection): void => {
    const { onChange, selected, job } = this.props;

    const newSelected = {
      [job.id]: {
        selected: selected[job.id.toString()].selected,
        visits: { ...selected[job.id.toString()].visits, ...selection}
      }
    };

    onChange(newSelected);
  }
};

export default InvoiceBatchClient;