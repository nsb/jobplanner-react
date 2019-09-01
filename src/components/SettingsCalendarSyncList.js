// @flow

import React, { Component } from "react";
import { injectIntl, FormattedMessage, intlShape } from "react-intl";
import type { Business } from "../actions/businesses";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';

const intlTitle = (
  <FormattedMessage
    id="settingsCalendarSyncList.title"
    description="Settings calendar sync list title"
    defaultMessage="Calendar Sync"
  />
)

const intlParagraph1 = (
  <FormattedMessage
    id="settingsCalendarSyncList.paragraph1"
    description="Settings calendar sync list paragraph"
    defaultMessage="Sync your myJobPlanner calendar to apps like iCal or Google Calendar."
  />
)

const intlLabel = (
  <FormattedMessage
    id="settingsCalendarSyncList.label"
    description="Settings calendar sync list label"
    defaultMessage="Copy the URL below into your app's subscription settings:"
  />
)


type Props = {
  business: Business
};

class CalendarSyncList extends Component<Props & { intl: intlShape }> {

  render() {
    const { business: { ical_feed } } = this.props;
    return (
      <Box>
        <Header size="large" justify="between" pad="none">
          <Heading tag="h2" margin="none" strong={true}>
            {intlTitle}
          </Heading>
        </Header>
        <Paragraph>
          {intlParagraph1}
        </Paragraph>
        <div>{intlLabel}</div>
        <FormField>
          <TextInput id='ical_feed'
            name='Ical Feed'
            value={ical_feed} />
        </FormField>
      </Box>
    );
  }
}

export default injectIntl(CalendarSyncList);
