import React from "react";
import Article from "grommet/components/Article";
import Section from "grommet/components/Section";
import Spinning from "grommet/components/icons/Spinning";
import { AuthConsumer } from "../providers/authProvider";

export const LogoutCallback = () => (
    <AuthConsumer>
        {({ signoutRedirectCallback }) => {
            signoutRedirectCallback();
            return <Article scrollStep={true} controls={true}>
            <Section
              full={true}
              colorIndex="dark"
              texture="url(img/ferret_background.png)"
              pad="large"
              justify="center"
              align="center"
            >
              <Spinning size="large" />
            </Section>
          </Article>
        }}
    </AuthConsumer>
);