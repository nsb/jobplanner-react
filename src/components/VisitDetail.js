// @flow

import React, { Component } from "react";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Section from "grommet/components/Section";
import Columns from "grommet/components/Columns";
import Timestamp from "grommet/components/Timestamp";
import Anchor from "grommet/components/Anchor";
import Menu from "grommet/components/Menu";
import ScheduleIcon from "grommet/components/icons/base/Schedule";
import ActionsIcon from "grommet/components/icons/base/Actions";
import DirectionsIcon from "grommet/components/icons/base/Directions";
import type { Visit } from "../actions/visits";
import type { Property } from "../actions/properties";
import type { LineItem } from "../actions/lineitems";

export type Props = {
  visit: Visit,
  token: ?string,
  property: Property,
  assigned: Array<Object>,
  lineItems: Array<LineItem>,
  onEdit: Function,
  partialUpdateVisit: Function,
  onDelete: Function,
  onClose: Function
};

class VisitDetail extends Component<Props> {
  render() {
    const { visit, property, assigned, lineItems, onEdit, onDelete } = this.props;

    let schedule;
    schedule = (
      <Anchor icon={<ScheduleIcon />}
        label={
          <Timestamp
            fields={visit.anytime ? "date" : ["date", "time"]}
            value={visit.begins}
          />}
      />)

    let directions;
    let directionsParams = new URLSearchParams({
      q: `${property.address1}, ${property.city}, ${property.zip_code}, ${property.country}`
    });
    directions = (
      <Anchor icon={<DirectionsIcon />}
        href={`https://maps.google.com/?${directionsParams.toString()}`}
        target='_blank'
        primary={true} >
        Directions
      </Anchor >)

    return (
      <Box>
        <Header justify="between" pad="none">
          <Heading tag="h4" margin="none" strong={true}>
            Visit
          </Heading>
        </Header>

        <Section pad="none">
          <Columns masonry={false} maxCount={2}>
            <Box pad={{ horizontal: "none", vertical: "none" }}>
              <Heading tag="h2" strong={true}>
                {visit.client_name}
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
              {property.address1}
              <br />
              {property.address2}
              <br />
              {property.zip_code} {property.city}
            </Box>
            <Box pad={{ horizontal: "none", vertical: "small" }}>
              {visit.details}
            </Box>
            <Box pad={{ horizontal: "none", vertical: "small" }}>
              <Menu
                responsive={true}
                inline={false}
                primary={false}
                label="Actions"
                icon={<ActionsIcon />}
                Directions >
                <Anchor href="#" onClick={onEdit}>
                  Edit
                </Anchor>
                <Anchor href="#" onClick={onDelete}>
                  Delete
                </Anchor>
                <Anchor href="#" onClick={this.toggleCompleted}>
                  {visit.completed ? "Mark incomplete" : "Mark completed"}
                </Anchor>
              </Menu>
            </Box>
            <Box colorIndex="light-2" pad={{ horizontal: "small", vertical: "small" }}>
              <Heading tag="h4" strong={true}>
                <Box direction="row">Job</Box>
              </Heading>
              Job #{visit.job}
            </Box>
            <Box colorIndex="light-2" pad={{ horizontal: "small", vertical: "small" }}>
              <Heading tag="h4" strong={true}>
                <Box direction="row">Team</Box>
              </Heading>
              {assigned ? (
                assigned.map(employee => {
                  return <div>{employee.username}</div>;
                })
              ) : (
                  <div>Unassigned</div>
                )}
            </Box>
          </Columns>
          <Box pad={{ horizontal: "none", vertical: "small" }}>
            <Heading tag="h4" strong={true}>
              <Box direction="row">Line Items</Box>
            </Heading>
            {lineItems.map(item => {
              return <div>{item.name}</div>;
            })}
          </Box>
        </Section>
      </Box>
    );
  }

  toggleCompleted = () => {
    const { visit, token, partialUpdateVisit, onClose } = this.props;
    if (token) {
      partialUpdateVisit({ id: visit.id, completed: !visit.completed }, token);
      onClose();
    }
  };
}

export default VisitDetail;
