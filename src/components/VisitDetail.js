// @flow

import React from "react";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Section from "grommet/components/Section";
import Columns from "grommet/components/Columns";
import Timestamp from "grommet/components/Timestamp";
import Anchor from "grommet/components/Anchor";
import Menu from 'grommet/components/Menu';
import ScheduleIcon from "grommet/components/icons/base/Schedule";
import ActionsIcon from "grommet/components/icons/base/Actions";
import type { Visit } from "../actions/visits";
import type { Property } from "../actions/properties";
import type { LineItem } from "../actions/lineitems";

type Props = {
  visit: Visit,
  property: Property,
  assigned: Array<Object>,
  lineItems: Array<LineItem>,
  onEdit: Function
};

export default ({ visit, property, assigned, lineItems, onEdit }: Props) =>
  <Box>
    <Header size="large" justify="between" pad="none">
      <Heading tag="h2" margin="none" strong={true}>
        Visit
      </Heading>
    </Header>

    <Section pad="small">
      <Columns masonry={false} maxCount={2}>
        <Box>
          <Heading tag="h4" margin="none">
            {visit.client_name}
          </Heading>
          {property.address1}<br />
          {property.address2}<br />
        </Box>
        <Box>
          <Heading tag="h4">
            <Box direction="row">
              <ScheduleIcon />
              <Timestamp
                fields={visit.anytime ? "date" : ["date", "time"]}
                value={visit.begins}
              />
            </Box>
          </Heading>
        </Box>
        <Box margin="small">
          {visit.client_phone}
        </Box>
        <Box>
          <Menu responsive={true}
            inline={false}
            primary={false}
            label='Actions'
            icon={<ActionsIcon />}>
            <Anchor href='#'
              onClick={onEdit}>
              Edit
            </Anchor>
            <Anchor href='#'>
              Delete
            </Anchor>
            <Anchor href='#'>
              Mark complete
            </Anchor>
          </Menu>
        </Box>
        <Box colorIndex="light-2" pad="small" margin="small">
          <Heading tag="h4" strong={true}>
            <Box direction="row">
              Job
            </Box>
          </Heading>
          Job #{visit.job}
        </Box>
        <Box colorIndex="light-2" pad="small" margin="small">
          <Heading tag="h4" strong={true}>
            <Box direction="row">
              Team
            </Box>
          </Heading>
          {assigned
            ? assigned.map(employee => {
                return <div>{employee.username}</div>;
              })
            : <div>Unassigned</div>}
        </Box>
      </Columns>
      <Box>
        <Heading tag="h4" strong={true}>
          <Box direction="row">
            Line Items
          </Box>
        </Heading>
        {lineItems.map(item => {
          return <div>{item.name}</div>;
        })}
      </Box>
    </Section>

  </Box>;