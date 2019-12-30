// @flow

import React from "react";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

type Props = {
  text: string,
  color?: string,
  margin?: Object
};

export const Tag = ({
  text,
  color = "warning",
  margin = { vertical: "small" }
}: Props) => (
  <Box
    alignContent="start"
    alignSelf="start"
    margin={margin}
    pad={{ horizontal: "small" }}
    colorIndex={color}
  >
    <Heading tag="h6" uppercase={true} truncate={true} pad="none" margin="none">
      {text}
    </Heading>
  </Box>
);

export default Tag;
