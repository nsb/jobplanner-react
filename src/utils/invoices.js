// @flow

import React from "react";
import { FormattedMessage } from "react-intl";
import type { Client } from "../actions/clients";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";

export const intlCreateButton = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="invoices.createButton"
    description="Invoices create button"
    defaultMessage="Create invoices"
  />
);

export const intlEmptyMessage = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="invoices.emptyMessage"
    description="Invoices empty message"
    defaultMessage="Nothing to invoice"
  />
);

export type VisitSelection = Map<number, boolean>;
export type JobSelection = Map<
  number,
  { selected: boolean, visits: VisitSelection }
>;
export type ClientSelection = Map<
  number,
  { selected: boolean, jobs: JobSelection }
>;

export const visitState = (visit: ?Visit): VisitSelection =>
  visit ? new Map([[visit.id, visit.completed]]) : new Map();

export const jobState = (
  job: Job,
  visits: Map<number, Visit>
): JobSelection => {
  const visitsForJob: Array<Visit> = [];
  job.visits.forEach(visitId => {
    const visit = visits.get(visitId);
    if (visit) {
      visitsForJob.push(visit);
    }
  });

  return new Map([
    [
      job.id,
      {
        selected: visitsForJob.some(visit => visit && visit.completed),
        visits: visitsForJob.reduce(
          (acc, visit) => new Map([...acc, ...visitState(visit)]),
          new Map()
        )
      }
    ]
  ]);
};

export const jobStates = (
  jobs: Map<number, Job>,
  visits: Map<number, Visit>
): JobSelection => {
  const jobSelections: Array<JobSelection> = [];
  Array.from(jobs.keys()).forEach((jobId: number) => {
    const job = jobs.get(jobId);
    if (job) {
      jobSelections.push(jobState(job, visits));
    }
  });

  return jobSelections.reduce(
    (acc, jobSelection: JobSelection) => new Map([...acc, ...jobSelection]),
    new Map()
  );
};

export const clientState = (
  client: ?Client,
  jobs: Map<number, Job>,
  visits: Map<number, Visit>
): ClientSelection => {
  if (client) {
    const jobSelections: Array<JobSelection> = [];
    Array.from(jobs.keys()).forEach((jobId: number) => {
      const job = jobs.get(jobId);
      if (job) {
        jobSelections.push(jobState(job, visits));
      }
    });

    return new Map([
      [
        client.id,
        {
          selected: false,
          jobs: jobSelections.reduce(
            (acc, jobSelection: JobSelection) =>
              new Map([...acc, ...jobSelection]),
            new Map()
          )
        }
      ]
    ]);
  } else {
    return new Map();
  }
};

export const batchState = (
  clients: Map<number, Client>,
  jobs: Map<number, Job>,
  visits: Map<number, Visit>
): ClientSelection => {
  return Array.from(clients.keys()).reduce(
    (acc, clientId: number) =>
      new Map([...acc, ...clientState(clients.get(clientId), jobs, visits)]),
    new Map()
  );
};

export const getInvoiceForJobSelection = (
  clientId: number,
  jobs: JobSelection
): { client: number, visits: Array<number> } => {
  let visitIds = [];

  let selectedJobIds = Array.from(jobs.keys()).filter((jobId: number) => {
    const job = jobs.get(jobId);
    return job && job.selected;
  });
  for (let jobId: number of selectedJobIds) {
    const jobSelection = jobs.get(jobId);
    let visits = (jobSelection && jobSelection.visits) || new Map();
    let selectedVisitIds = Array.from(visits.keys()).filter((visitId: number) =>
      visits.get(visitId)
    );
    visitIds.push(...selectedVisitIds);
  }
  return {
    client: clientId,
    visits: visitIds.map((id: number) => parseInt(id, 10))
  };
};
