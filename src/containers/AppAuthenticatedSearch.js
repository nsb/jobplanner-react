import React, { Component } from "react"
import Article from 'grommet/components/Article'
import Header from 'grommet/components/Header'
import Search from 'grommet/components/Search'
import NavControl from '../components/NavControl'

class AppAuthenticatedSearch extends Component {

  render() {
    return (
      <Article ref="content" pad="none">
        <Header direction="row" justify="between" size="large"
          pad={{ horizontal: 'medium', between: 'small' }}>
          <NavControl />
          <Search ref="search" inline={true} responsive={false} fill={true}
            size="medium" placeHolder="Search" />
        </Header>

        {this.props.children}

      </Article>
    )
  }
}

export default AppAuthenticatedSearch
