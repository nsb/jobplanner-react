// @flow

import React from "react";
import type { Visit } from "../actions/visits";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";

type Props = {
  visit: Visit
};

export default (props: Props) =>
  <Box>
    <Header size="large" justify="between" pad="none">
      <Heading tag="h2" margin="none" strong={true}>
        Visit
      </Heading>
    </Header>
  </Box>;
