// @flow

import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from "react-intl";
import Box from "grommet/components/Box";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import CheckBox from 'grommet/components/CheckBox';
import InvoiceBatchVisitContainer from "./InvoiceBatchVisitContainer";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";
import type { VisitSelection } from "./InvoiceBatchVisit";

const intlRecurringJob = (id: number) => (
  <FormattedMessage
    id="invoiceBatch.recurringJob"
    description="invoice batch job type recurring"
    defaultMessage="#{id} - Recurring job"
    values={{id}}
  />
);

const intlOneOffJob = (id: number) => (
  <FormattedMessage
    id="invoiceBatch.oneOffJob"
    description="invoice batch job type one-off"
    defaultMessage="#{id} - One-off job"
    values={{id}}
  />
);

export type JobSelection = Map<number, { selected: boolean, visits: VisitSelection }>;

export type Props = {
  job: Job,
  visits: Array<Visit>,
  selected: JobSelection,
  onChange: (JobSelection) => void
};

class InvoiceBatchClient extends Component<Props> {

  render() {
    const { job, visits, selected } = this.props;
    const jobSelection = selected.get(job.id);

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
              checked={jobSelection && jobSelection.selected}
              onChange={this.onJobChanged} />
            {job.recurrences ? intlRecurringJob(job.id) : intlOneOffJob(job.id)}
          </Box>
          <List onMore={undefined}>
            {(jobSelection && jobSelection.selected ? visits : []).map((visit, index) => {
              return (
                <InvoiceBatchVisitContainer
                  visit={visit}
                  key={index}
                  selected={new Map([[visit.id, jobSelection && jobSelection.visits.get(visit.id)]])}
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
    const jobSelection = selected.get(job.id);

    onChange(new Map(
      [[job.id, {
        ...jobSelection,
        ...{ selected: !(jobSelection && jobSelection.selected) || false}
      }]]
    ));
  }

  onVisitChanged = (selection: VisitSelection): void => {
    const { onChange, selected, job } = this.props;
    const jobSelection = selected.get(job.id);

    const newSelected = new Map(
      [[job.id, {
        selected: jobSelection && jobSelection.selected || false,
        visits: new Map([...(jobSelection && jobSelection.visits || new Map()), ...selection])
      }]]
    );

    onChange(newSelected);
  }
};

export default injectIntl(InvoiceBatchClient);