// @flow

import React from "react";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Section from "grommet/components/Section";
import Columns from "grommet/components/Columns";
import Timestamp from "grommet/components/Timestamp";
import ScheduleIcon from "grommet/components/icons/base/Schedule";
import type { Visit } from "../actions/visits";
import type { Property } from "../actions/properties";

type Props = {
  visit: Visit,
  property: Property
};

export default ({ visit, property }: Props) =>
  <Box>
    <Header size="large" justify="between" pad="none">
      <Heading tag="h2" margin="none" strong={true}>
        Visit
      </Heading>
    </Header>

    <Section pad="medium">
      <Columns masonry={false} maxCount={2}>
        <Box>
          <Heading tag="h4" margin="none">
            {visit.client_name}
          </Heading>
          {property.address1}<br />
          {property.address2}<br />
        </Box>
        <Box>
          <Heading tag="h4" margin="none">
            <Box direction="row">
              <ScheduleIcon />
              <Timestamp
                fields={visit.anytime ? "date" : ["date", "time"]}
                value={visit.begins}
              />
            </Box>
          </Heading>
          {visit.client_phone}
        </Box>
      </Columns>
    </Section>

  </Box>;
