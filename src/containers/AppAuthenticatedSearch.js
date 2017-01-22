import React, { Component } from "react"
import { Article, Header, Search } from 'grommet'

class AppAuthenticatedSearch extends Component {

  render() {
    return (
      <Article ref="content" pad="none">
        <Header direction="row" justify="between" size="large"
          pad={{ horizontal: 'medium', between: 'small' }}>

          <Search ref="search" inline={true} responsive={false} fill={true}
            size="medium" placeHolder="Search" />
        </Header>

        {this.props.children}

      </Article>
    );
  }
}

export default AppAuthenticatedSearch
