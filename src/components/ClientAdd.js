import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Article from 'grommet/components/Article'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import Form from 'grommet/components/Form'
import Footer from 'grommet/components/Footer'
import FormFields from 'grommet/components/FormFields'
import FormField from 'grommet/components/FormField'
import CloseIcon from 'grommet/components/icons/base/Close'

class ClientAdd extends Component {
  static propTypes = {
    nav: PropTypes.object,
  }

  render () {
    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>
        <Form onSubmit={this._onSubmit}>

          <Header size="large" justify="between" pad="none">
            <Heading tag="h2" margin="none" strong={true}>
              Add Client
            </Heading>
            <Anchor icon={<CloseIcon />} onClick={this.onClose}
              a11yTitle='Close Add Client Form' />
          </Header>

          <FormFields>

            <fieldset>

              <FormField label="Name" htmlFor="name" error={null}>
                <input id="name" name={"template.name"} type="text"
                  value={''}
                  onChange={null} />
              </FormField>

            </fieldset>
          </FormFields>

          <Footer pad={{vertical: 'medium'}}>
            <span />
            <Button type="submit" primary={true} label="Add"
              onClick={this._onSubmit} />
          </Footer>
        </Form>
      </Article>
    )

  }

  onClose = () => {
    this.props.dispatch(push('/clients'))
  }
}

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps)(ClientAdd)
