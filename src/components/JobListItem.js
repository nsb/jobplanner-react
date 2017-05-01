// @flow

import React, {Component} from 'react';
import ListItem from 'grommet/components/ListItem';
import type {Job} from '../actions/jobs';

class JobListItem extends Component {
  props: {
    job: Job,
    index: number,
    onClick: Function,
  };

  render() {
    const {job, index, onClick} = this.props;
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
        <span>{job.description}</span>
      </ListItem>
    );
  }
}

export default JobListItem;
