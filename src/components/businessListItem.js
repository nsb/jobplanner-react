// @flow

import React, {Component} from 'react';
import ListItem from 'grommet/components/ListItem';
import type { Business } from '../actions/businesses'


class BusinessListItem extends Component {
  props: {
    business: Business,
    index: number,
    onClick: Function
  };

  render() {
    const {business, index, onClick} = this.props;
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
        <span>{business.name}</span>
      </ListItem>
    );
  }
}

export default BusinessListItem;
