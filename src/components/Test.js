import React, { Component } from "react"
import { Header, Heading, Section, Tile, Tiles } from 'grommet'

class Test extends Component {

  render() {
    return (

      <Section key="utilization" pad="medium" full="horizontal">
        <Header justify="between">
          <Heading tag="h2" margin="none">Utilization</Heading>
        </Header>
        <Tiles ref="utilizationMeters" fill={true}>
          <Tile pad="medium">
            <Header size="small" justify="center">
              <Heading tag="h3">CPU</Heading>
            </Header>
          </Tile>
          <Tile pad="medium">
            <Header size="small" justify="center">
              <Heading tag="h3">Memory</Heading>
            </Header>
          </Tile>
          <Tile pad="medium">
            <Header size="small" justify="center">
              <Heading tag="h3">Storage</Heading>
            </Header>
          </Tile>
        </Tiles>
      </Section>

    );
  }
}

export default Test
