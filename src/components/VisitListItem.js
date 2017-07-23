// @flow

import React, {Component} from 'react';
import moment from 'moment';
import ListItem from 'grommet/components/ListItem';
import CheckBox from 'grommet/components/CheckBox';
import type {Visit} from '../actions/visits';


class VisitListItem extends Component {
  props: {
    visit: Visit,
    index: number,
    onClick: SyntheticInputEvent => void,
  };

  render() {
    const {visit, index, onClick} = this.props;
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
        <CheckBox label='' />
        <span>{moment(visit.begins).format('l')}</span>
      </ListItem>
    );
  }
}

export default VisitListItem;