// @flow

import React, { Component } from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Section from "grommet/components/Section";
import Columns from "grommet/components/Columns";
import Timestamp from "grommet/components/Timestamp";
import Anchor from "grommet/components/Anchor";
import Menu from "grommet/components/Menu";
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import ScheduleIcon from "grommet/components/icons/base/Schedule";
import ActionsIcon from "grommet/components/icons/base/Actions";
import DirectionsIcon from "grommet/components/icons/base/Directions";
import { AuthContext } from "../providers/authProvider";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import type { Property } from "../actions/properties";
import type { LineItem } from "../actions/lineitems";
import type { LineItemOverride } from "../actions/lineitemoverrides";

const intlTitle = (
  <FormattedMessage
    id="visitDetail.title"
    description="Visit detail title"
    defaultMessage="Visit"
  />
);

const intlDirections = (
  <FormattedMessage
    id="visitDetail.directions"
    description="Visit detail directions"
    defaultMessage="Directions"
  />
);

const intlActions = (
  <FormattedMessage
    id="visitDetail.actionsHeading"
    description="Visit detail actions heading"
    defaultMessage="Actions"
  />
);

const intlEdit = (
  <FormattedMessage
    id="visitDetail.actionsEdit"
    description="Visit detail actions edit"
    defaultMessage="Edit"
  />
);

const intlUpdateFuture = (
  <FormattedMessage
    id="visitDetail.actionsUpdate"
    description="Visit detail actions update future visits"
    defaultMessage="Update future visits"
  />
);

const intlDelete = (
  <FormattedMessage
    id="visitDetail.actionsDelete"
    description="Visit detail actions delete"
    defaultMessage="Delete"
  />
);

const intlMarkCompleted = (
  <FormattedMessage
    id="visitDetail.actionsMarkCompleted"
    description="Visit detail actions mark completed"
    defaultMessage="Mark completed"
  />
);

const intlMarkIncomplete = (
  <FormattedMessage
    id="visitDetail.actionsMarkIncomplete"
    description="Visit detail actions mark incomplete"
    defaultMessage="Mark incomplete"
  />
);

const intlJob = id => (
  <FormattedMessage
    id="visitDetail.jobHeading"
    description="Visit detail job heading"
    defaultMessage="Job #{id}"
    values={{ id }}
  />
);

const intlTeam = (
  <FormattedMessage
    id="visitDetail.teamHeading"
    description="Visit detail team heading"
    defaultMessage="Team"
  />
);

const intlUnassigned = (
  <FormattedMessage
    id="visitDetail.teamUnassigned"
    description="Visit detail team unassigned"
    defaultMessage="Unassigned"
  />
);

const intlLineItems = (
  <FormattedMessage
    id="visitDetail.lineItemsHeading"
    description="Visit detail line items heading"
    defaultMessage="Line Items"
  />
);

export type Props = {
  visit: Visit,
  job: ?Job,
  property: Property,
  assigned: Array<Object>,
  lineItems: Array<LineItem | LineItemOverride>,
  onEdit: Function,
  onUpdateFutureVisits: Function,
  partialUpdateVisitAndLoadJob: Function,
  onDelete: Function,
  onClose: Function
};

class VisitDetail extends Component<Props & { intl: intlShape }> {
  static contextType = AuthContext;

  render() {
    const {
      visit,
      job,
      property,
      assigned,
      lineItems,
      onEdit,
      onUpdateFutureVisits,
      onDelete
    } = this.props;

    let schedule;
    schedule = (
      <Anchor
        icon={<ScheduleIcon />}
        label={
          <Timestamp
            fields={visit.anytime ? "date" : ["date", "time"]}
            value={visit.begins}
          />
        }
      />
    );

    let directions;
    if (property) {
      let directionsParams = new URLSearchParams({
        q: `${property.address1}, ${property.city}, ${property.zip_code}, ${property.country}`
      });
      directions = (
        <Anchor
          icon={<DirectionsIcon />}
          href={`https://maps.google.com/?${directionsParams.toString()}`}
          target="_blank"
          primary={true}
        >
          {intlDirections}
        </Anchor>
      );
    }

    return (
      <Box>
        <Header justify="between" pad="none">
          <Heading tag="h4" margin="none" strong={true}>
            {intlTitle}
          </Heading>
        </Header>

        <Section pad="none">
          <Columns masonry={false} maxCount={2}>
            <Box pad={{ horizontal: "none", vertical: "none" }}>
              <Heading tag="h2" strong={true}>
                {visit.title || visit.client_name}
              </Heading>
            </Box>
            <Box pad={{ horizontal: "none", vertical: "small" }}>
              {schedule}
              {directions}
              {visit.client_phone}
            </Box>
            <Box pad={{ horizontal: "none", vertical: "small" }}>
              {visit.client_name}
              <br />
              {property && property.address1}
              <br />
              {property && property.address2}
              <br />
              {property && property.zip_code} {property && property.city}
            </Box>
            <Box pad={{ horizontal: "none", vertical: "small" }}>
              {visit.details}
            </Box>
            <Box pad={{ horizontal: "none", vertical: "small" }}>
              <Menu
                responsive={true}
                inline={false}
                primary={false}
                label={intlActions}
                icon={<ActionsIcon />}
                Directions
              >
                <Anchor href="#" onClick={onEdit}>
                  {intlEdit}
                </Anchor>
                <Anchor href="#" onClick={onUpdateFutureVisits}>
                  {intlUpdateFuture}
                </Anchor>
                <Anchor href="#" onClick={onDelete}>
                  {intlDelete}
                </Anchor>
                <Anchor href="#" onClick={this.toggleCompleted}>
                  {visit.completed ? intlMarkIncomplete : intlMarkCompleted}
                </Anchor>
              </Menu>
            </Box>
            <Box
              colorIndex="light-2"
              pad={{ horizontal: "medium", vertical: "small" }}
            >
              <Heading tag="h4" strong={true}>
                <Box direction="row">
                  <Anchor path={`/${visit.business}/jobs/${visit.job}`}>
                    {intlJob(visit.job)}
                  </Anchor>
                </Box>
              </Heading>
              {job && job.description}
            </Box>
            <Box
              colorIndex="light-2"
              pad={{ horizontal: "medium", vertical: "small" }}
            >
              <Heading tag="h4" strong={true}>
                <Box direction="row">{intlTeam}</Box>
              </Heading>
              {assigned.length ? (
                assigned.map(employee => [employee.first_name, employee.last_name].join(' '))
                .join(", ")
              ) : (
                <div>{intlUnassigned}</div>
              )}
            </Box>
          </Columns>
          <Box pad={{ horizontal: "none", vertical: "small" }}>
            <Heading tag="h4" strong={true}>
              <Box direction="row">{intlLineItems}</Box>
            </Heading>
            <Table>
              <thead>
                <tr>
                  <th>
                    Service
                  </th>
                  <th>
                    Qty
                  </th>
                </tr>
              </thead>
            {lineItems.map(item => {
              return <TableRow>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                </TableRow>
              })}
            </Table>
          </Box>
        </Section>
      </Box>
    );
  }

  toggleCompleted = () => {
    const { visit, partialUpdateVisitAndLoadJob, onClose, intl } = this.props;
    const { getUser } = this.context;
    getUser()
      .then(({ access_token }) => {
        return partialUpdateVisitAndLoadJob(
          { id: visit.id, job: visit.job, completed: !visit.completed },
          access_token
        );
      })
      .then(() => {
        addSuccess({ text: intl.formatMessage({ id: "flash.saved" }) });
      })
      .catch(() => {
        addError({ text: intl.formatMessage({ id: "flash.error" }) });
      })
      .finally(onClose);
  };
}

export default injectIntl(VisitDetail);
