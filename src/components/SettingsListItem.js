// @flow

import React from 'react';
import ListItem from 'grommet/components/ListItem';
import Box from 'grommet/components/Box';

import type { Node, Element } from 'react';

type Props = {
  children?: Node,
  control: Element<*>
}

export default (props: Props) => {

  return (
    <ListItem
      pad={{vertical: 'medium', horizontal: 'medium', between: 'medium'}}
      justify="between" align="center" responsive={false}
      separator={props.first ? 'horizontal' : 'bottom'}>
      <Box>
        {props.children}
      </Box>
      {props.control}
    </ListItem>
  );
};
