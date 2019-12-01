// @flow

import React, { Component } from 'react';
import Box from "grommet/components/Box";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import CheckBox from 'grommet/components/CheckBox';
import InvoiceBatchJobContainer from "./InvoiceBatchJobContainer";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";
import type { JobSelection } from "./InvoiceBatchJob";

export type ClientSelection = Map<number, { selected: boolean, jobs: JobSelection }>;

export type Props = {
  client: Client,
  jobs: Array<Job>,
  selected: ClientSelection,
  onChange: (ClientSelection) => void
};

class InvoiceBatchClient extends Component<Props> {

  render() {
    const { client, jobs, selected } = this.props;
    const clientSelection = selected.get(client.id);

    return (
      <ListItem
        direction="column"
        align="start"
        separator="none"

      >
        <Box
          colorIndex="light-2"
          pad="medium"
          full={"horizontal"}
        >
          <Box
            direction="row"
          >
            <CheckBox
              checked={clientSelection && clientSelection.selected}
              onChange={this.onClientChanged}
            />
            {client.is_business ? client.business_name : `${client.first_name} ${client.last_name}`}
          </Box>
          <List onMore={undefined}>
            {(clientSelection && clientSelection.selected ? jobs : []).map((job: Job, index) => {
              return (
                <InvoiceBatchJobContainer
                  job={job}
                  selected={new Map([[job.id, clientSelection && clientSelection.jobs.get(job.id)]])}
                  onChange={this.onJobChanged} key={index}
                />
              )
            })}
          </List>
        </Box>
      </ListItem>
    )
  }

  onClientChanged = () => {
    const { onChange, client, selected } = this.props;
    const clientSelection = selected.get(client.id);

    if (clientSelection) {
      onChange(new Map(
        [[client.id, {
          ...clientSelection,
          ...{ selected: !(clientSelection && clientSelection.selected) || false }
        }]]
      ));
    }
  }

  onJobChanged = (selection: JobSelection) => {
    const { onChange, selected, client } = this.props;
    const clientSelection = selected.get(client.id);

    const newSelected = new Map(
      [[client.id, {
        selected: (clientSelection && clientSelection.selected) || false,
        jobs: new Map([...((clientSelection && clientSelection.jobs) || new Map()), ...selection])
      }]]
    );

    onChange(newSelected);
  }
};

export default InvoiceBatchClient;