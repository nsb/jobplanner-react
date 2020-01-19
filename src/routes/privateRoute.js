import React from "react";
import { Route } from "react-router-dom";
import { AuthConsumer } from "../providers/authProvider";
import Article from "grommet/components/Article";
import Section from "grommet/components/Section";
import Spinning from "grommet/components/icons/Spinning";

export const PrivateRoute = ({ component, ...rest }) => {
    const renderFn = (Component) => (props) => (
        <AuthConsumer>
            {({ isAuthenticated, signinRedirect }) => {
                if (!!Component && isAuthenticated()) {
                    return <Component {...props} />;
                } else {
                    signinRedirect();
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
                }
            }}
        </AuthConsumer>
    );

    return <Route {...rest} render={renderFn(component)} />;
};