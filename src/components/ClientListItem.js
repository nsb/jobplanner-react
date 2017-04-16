import React, { Component, PropTypes } from 'react'
import ListItem from 'grommet/components/ListItem'

class ClientListItem extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render () {
    const { client, index, onClick } = this.props
    return (
      <ListItem direction="row" align="center" justify="between"
        separator={index === 0 ? 'horizontal' : 'bottom'}
        pad={{horizontal: 'medium', vertical: 'small', between: 'medium'}}
        responsive={false}
        onClick={onClick} selected={false}>
        <span>{client.first_name} {client.last_name}</span>
      </ListItem>
    )
  }

}

export default ClientListItem
