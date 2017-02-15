import React, { Component, PropTypes } from 'react'
import ListItem from 'grommet/components/ListItem'

class BusinessListItem extends Component {
  static propTypes = {
    business: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render () {
    const { business, index, onClick } = this.props
    return (
      <ListItem direction="row" align="center" justify="between"
        separator={index === 0 ? 'horizontal' : 'bottom'}
        pad={{horizontal: 'medium', vertical: 'small', between: 'medium'}}
        responsive={false}
        onClick={onClick} selected={false}>
        <span>{business.name}</span>
      </ListItem>
    )
  }

}

export default BusinessListItem
