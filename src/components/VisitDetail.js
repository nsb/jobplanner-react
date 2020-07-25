// @flow

import React, { Component } from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Section from "grommet/components/Section";
import Timestamp from "grommet/components/Timestamp";
import Button from "grommet/components/Button";
import Anchor from "grommet/components/Anchor";
import Menu from "grommet/components/Menu";
import ScheduleIcon from "grommet/components/icons/base/Schedule";
import DirectionsIcon from "grommet/components/icons/base/Directions";
import ContactIcon from "grommet/components/icons/base/Contact";
import EditIcon from "grommet/components/icons/base/Edit";
import CheckmarkIcon from "grommet/components/icons/base/Checkmark";
import CloseIcon from "grommet/components/icons/base/Close";
import TrashIcon from "grommet/components/icons/base/Trash";
import UpdateIcon from "grommet/components/icons/base/Update";
import BusyIcon from "grommet/components/icons/Spinning";
import Table from "grommet/components/Table";
import TableRow from "grommet/components/TableRow";
import VisitStatusTag from "./VisitStatusTag";
import { Can } from "./Can";
import { AuthContext } from "../providers/authProvider";
import { intlFormSavingLabel } from "../i18n";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import type { Property } from "../actions/properties";

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

const intlJob = (id) => (
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

const intlLineItemName = (
  <FormattedMessage
    id="visitDetail.lineItemNameLabel"
    description="Visit detail line item name label"
    defaultMessage="Name"
  />
);

const intlLineItemQuantity = (
  <FormattedMessage
    id="visitDetail.lineItemQuantityLabel"
    description="Visit detail line item quantity label"
    defaultMessage="Qty"
  />
);

export type Props = {
  visit: Visit,
  job: ?Job,
  property: Property,
  assigned: Array<Object>,
  onEdit: Function,
  onUpdateFutureVisits: Function,
  partialUpdateVisitAndLoadJob: Function,
  onDelete: Function,
  onClose: Function,
  isFetching: boolean,
};

class VisitDetail extends Component<Props & { intl: intlShape }> {
  static contextType = AuthContext;

  render() {
    const {
      visit,
      job,
      property,
      assigned,
      onEdit,
      onUpdateFutureVisits,
      onDelete,
      isFetching,
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

    let phone;
    if (visit.client_phone) {
      phone = (
        <Anchor icon={<ContactIcon />} href={`tel:${visit.client_phone}`}>
          {visit.client_phone}
        </Anchor>
      );
    }

    let directions;
    if (property) {
      let directionsParams = new URLSearchParams({
        q: `${property.address1}, ${property.city}, ${property.zip_code}, ${property.country}`,
      });
      directions = (
        <Anchor
          icon={<DirectionsIcon />}
          href={`https://maps.google.com/?${directionsParams.toString()}`}
          target="_blank"
          primary={false}
        >
          {intlDirections}
        </Anchor>
      );
    }

    let toggleCompletedButton;
    if (!visit.completed) {
      toggleCompletedButton = isFetching ? (
        <Box
          direction="row"
          align="center"
          pad={{ horizontal: "medium", between: "small" }}
        >
          <BusyIcon />
          <span className="secondary">{intlFormSavingLabel}</span>
        </Box>
      ) : (
        <Box margin={{ bottom: "small" }}>
          <Button
            primary={true}
            label={intlMarkCompleted}
            onClick={this.toggleCompleted}
          />
        </Box>
      );
    }

    return (
      <Box margin={{ top: "medium" }}>
        <Box>
          <Heading tag="h4" strong={true}>
            {intlTitle}
          </Heading>
          <VisitStatusTag status={visit.status} />
          <Heading tag="h3" strong={true}>
            {visit.title || visit.client_name}
          </Heading>
        </Box>
        <Section>
          <Box margin={{ bottom: "medium" }}>{schedule}</Box>
          <Box margin={{ bottom: "medium" }}>
            {visit.client_name}
            <br />
            {property && property.address1}
            <br />
            {property && property.address2}
            <br />
            {property && property.zip_code} {property && property.city}
            {directions}
            {phone}
            {visit.details}
          </Box>
          {toggleCompletedButton}
          <Can I="update" a="Visit">
            <Box margin={{ bottom: "small" }}>
              <Menu
                size="small"
                responsive={true}
                inline={false}
                primary={false}
                label={intlActions}
                Directions
              >
                <Anchor icon={<EditIcon />} onClick={onEdit}>
                  {intlEdit}
                </Anchor>
                <Anchor icon={<UpdateIcon />} onClick={onUpdateFutureVisits}>
                  {intlUpdateFuture}
                </Anchor>
                <Anchor icon={<TrashIcon />} onClick={onDelete}>
                  {intlDelete}
                </Anchor>
                <Anchor
                  icon={visit.completed ? <CloseIcon /> : <CheckmarkIcon />}
                  onClick={this.toggleCompleted}
                >
                  {visit.completed ? intlMarkIncomplete : intlMarkCompleted}
                </Anchor>
              </Menu>
            </Box>
          </Can>
          <Box
            colorIndex="light-2"
            pad={{ horizontal: "medium", vertical: "small" }}
            margin={{ bottom: "small" }}
          >
            <Heading tag="h4" strong={true}>
              <Box direction="row">
                <Anchor path={`/${visit.business}/jobs/${visit.job}`}>
                  {intlJob(visit.job)}
                </Anchor>
              </Box>
            </Heading>
            {job && job.description}
            <Heading tag="h4" strong={true}>
              <Box direction="row">{intlTeam}</Box>
            </Heading>
            {assigned.length ? (
              assigned
                .map((employee) =>
                  [employee.first_name, employee.last_name].join(" ")
                )
                .join(", ")
            ) : (
              <div>{intlUnassigned}</div>
            )}
          </Box>
          <Box>
            <Heading tag="h4" strong={true}>
              <Box direction="row">{intlLineItems}</Box>
            </Heading>
            <Table>
              <thead>
                <tr>
                  <th>{intlLineItemName}</th>
                  <th>{intlLineItemQuantity}</th>
                </tr>
              </thead>
              <tbody>
                {visit.line_items
                  .filter((line_item) => line_item.quantity)
                  .map((item) => {
                    return (
                      <TableRow>
                        <td>{item.name}</td>
                        <td className="secondary">{item.quantity}</td>
                      </TableRow>
                    );
                  })}
              </tbody>
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
