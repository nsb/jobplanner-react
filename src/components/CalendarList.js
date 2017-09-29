// @flow
import React, { Component } from "react";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import type { Business } from "../actions/businesses";
import type { Visit } from "../actions/visits";
import Box from "grommet/components/Box";
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import NavControl from './NavControl';
import VisitList from "./VisitList";

type Props = {
  business: Business,
  visits: Array<Visit>,
  intl: intlShape
};

class CalendarList extends Component<Props> {

  render() {
    const { business, visits } = this.props;

    return (
      <Box>
        <Header size="large" pad={{horizontal: 'medium'}}>
          <Title responsive={false}>
            <NavControl />
            <FormattedMessage
              id="visits.title"
              description="Visits title"
              defaultMessage="Visits"
            />
          </Title>
        </Header>
        <VisitList visits={visits} business={business} />
      </Box>
    );
  }
}

export default injectIntl(CalendarList);
