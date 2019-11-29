// @flow
import React from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import type { Business } from "../actions/businesses";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import NavControl from "./NavControl";
import VisitListContainer from "./VisitListContainer";

type Props = {
  business: Business,
  intl: intlShape
};

const CalendarList = ({ business }: Props) =>
  <Box>
    <Header size="large" pad={{ horizontal: "medium" }}>
      <Title responsive={false}>
        <NavControl />
        <FormattedMessage
          id="calendarlist.title"
          description="Calendarlist title"
          defaultMessage="Calendar"
        />
      </Title>
    </Header>
    <VisitListContainer business={business} />
  </Box>

export default injectIntl(CalendarList);
