// @flow

import React from "react";
import Article from "grommet/components/Article";
import Section from "grommet/components/Section";
import Spinning from "grommet/components/icons/Spinning";

export default () => (
  <Article scrollStep={true} controls={true}>
    <Section full={true} pad="large" justify="center" align="center">
      <Spinning size="large" />
    </Section>
  </Article>
);
