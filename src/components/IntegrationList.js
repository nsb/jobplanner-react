// @flow

import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import Tiles from "grommet/components/Tiles";
import Tile from "grommet/components/Tile";
import Card from "grommet/components/Card";
import Anchor from "grommet/components/Anchor";
import DineroLogo from "../logo_dinero.svg";

const intlDineroDescription = (
  <FormattedMessage
    id="integrationList.DineroDescription"
    description="Integration list Dinero description"
    defaultMessage="Automatically create invoices with Dinero."
  />
)

const intlDineroLabel = (
  <FormattedMessage
    id="integrationList.DineroLabel"
    description="Integration list Dinero label"
    defaultMessage="Go to Dinero Add-on"
  />
)

const IntegrationList = () => (
  <Tiles pad='medium' margin='medium'>
    <Tile>
      <Card thumbnail={DineroLogo}
        colorIndex='light-2'
        contentPad='small'
        textSize='small'
        heading='Dinero'
        description={intlDineroDescription}
        link={<Anchor href='https://dinero.myjobplanner.com'
          label={intlDineroLabel}
          target='_' />} />
    </Tile>
  </Tiles>
);

export default injectIntl(IntegrationList);