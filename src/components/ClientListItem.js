// @flow

import React, {Component} from 'react';
import ListItem from 'grommet/components/ListItem';
import type {Client} from '../actions/clients';

class ClientListItem extends Component {
  props: {
    client: Client,
    index: number,
    onClick: SyntheticInputEvent => void,
  };

  render() {
    const {client, index, onClick} = this.props;
    return (
      <ListItem
        direction="row"
        align="center"
        justify="between"
        separator={index === 0 ? 'horizontal' : 'bottom'}
        pad={{horizontal: 'medium', vertical: 'small', between: 'medium'}}
        responsive={false}
        onClick={onClick}
        selected={false}
      >
        <span>{client.first_name} {client.last_name}</span>
      </ListItem>
    );
  }
}

export default ClientListItem;
