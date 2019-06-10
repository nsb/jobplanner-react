// @flow

import React from "react";
import Tiles from "grommet/components/Tiles";
import Tile from "grommet/components/Tile";
import Card from "grommet/components/Card";
import Anchor from "grommet/components/Anchor";
import DineroLogo from "../logo_dinero.svg";

export default () => (
  <Tiles pad='medium' margin='medium'>
    <Tile>
      <Card thumbnail={DineroLogo}
        colorIndex='light-2'
        contentPad='small'
        textSize='small'
        heading='Dinero Integration'
        description='Automatically create invoices with Dinero.'
        link={<Anchor href='https://dinero.myjobplanner.com'
          label='Go to Dinero Addon'
          target='_' />} />
    </Tile>
  </Tiles>
);



