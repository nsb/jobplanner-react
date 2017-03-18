import React, { Component } from 'react'
import LayerForm from 'grommet-templates/components/LayerForm';

class JobScheduleEdit extends Component {
  static propTypes = {
  }

  render () {

    return (
          <LayerForm title={this.props.heading} submitLabel="OK"
            onClose={this.props.onClose} onSubmit={this._onSubmit}
            secondaryControl={null}>
            <fieldset>
              Every other week
            </fieldset>
          </LayerForm>
        )
  }
}

export default JobScheduleEdit
