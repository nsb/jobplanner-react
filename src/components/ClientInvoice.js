// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import { addSuccess, addError } from "redux-flash-messages";
import Box from "grommet/components/Box";
import List from "grommet/components/List";
import InvoiceBatchJobContainer from "./InvoiceBatchJobContainer";
import { ensureState } from "redux-optimistic-ui";
import { clientState } from "../utils/invoices";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { ClientSelection, JobSelection } from "../utils/invoices";

type Props = {
  token: ?string,
  onClose: Function,
  client: Client,
  jobs: Array<Job>,
  selected: ClientSelection
};

type State = {
  selected: JobSelection
};

class ClientInvoice extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { client, selected } = props;
    const clientSelection = selected.get(client.id);
    this.state = {
      selected: (clientSelection && clientSelection.jobs) || new Map()
    };
  }

  render() {
    const { client, jobs } = this.props;

    return (
      <Box>
        {client.is_business
          ? client.business_name
          : `${client.first_name} ${client.last_name}`}
        <List onMore={undefined}>
          {jobs.map((job: Job, index) => {
            return (
              <InvoiceBatchJobContainer
                job={job}
                selected={
                  new Map([
                    [
                      job.id,
                      this.state.selected && this.state.selected.get(job.id)
                    ]
                  ])
                }
                onChange={this.onChange}
                key={index}
              />
            );
          })}
        </List>
      </Box>
    );
  }

  onChange = (selection: JobSelection) => {
    this.setState({
      selected: new Map([...this.state.selected, ...selection])
    });
  };
}

const mapStateToProps = (
  state: ReduxState,
  {
    onClose,
    client
  }: {
    onClose: Function,
    client: Client
  }
): Props => {
  const { auth, entities, jobs } = state;

  const jobsForClient: Array<Job> = jobs.result
    .map((Id: number): Array<Job> => {
      return ensureState(entities).jobs[Id];
    })
    .filter(job => job.client === client.id);

  const jobSelection: Map<number, Job> = jobsForClient.reduce(
    (acc: Map<number, Job>, job: Job) => {
      acc.set(job.id, job);
      return acc;
    },
    new Map()
  );

  const visitSelection: Map<number, Visit> = jobsForClient
    .flatMap((job: Job) => {
      return job.visits.map((visitId: number) => {
        return ensureState(entities).visits[visitId];
      });
    })
    .reduce((acc: Map<number, Visit>, visit: Visit) => {
      acc.set(visit.id, visit);
      return acc;
    }, new Map());

  return {
    token: auth.token,
    selected: clientState(client, jobSelection, visitSelection),
    jobs: jobsForClient,
    onClose,
    client
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ClientInvoice);
