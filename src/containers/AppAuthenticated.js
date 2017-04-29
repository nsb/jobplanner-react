import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import logo from '../logo.svg';
import {
  navToggle,
  navResponsive,
  verifyAuthAndFetchBusinesses,
} from '../actions';

class AppAuthenticated extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    token: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const {token, dispatch} = this.props;
    dispatch(verifyAuthAndFetchBusinesses(token));
  }

  render() {
    const {hasLoaded, isFetching} = this.props;

    if (hasLoaded && !isFetching) {
      return (
        <div>
          {this.props.children}
        </div>
      );
    } else {
      return (
        <Article scrollStep={true} controls={true}>
          <Section
            full={true}
            colorIndex="dark"
            texture="url(img/ferret_background.png)"
            pad="large"
            justify="center"
            align="center"
          >
            <img src={logo} className="App-logo" alt="logo" />
          </Section>
        </Article>
      );
    }
  }

  onResponsive = responsive => {
    this.props.dispatch(navResponsive(responsive));
  };

  toggleNav = () => {
    this.props.dispatch(navToggle());
  };
}

const mapStateToProps = state => {
  const {users, auth, businesses} = state;

  return {
    isAuthenticated: auth.isAuthenticated,
    isFetching: users.isFetching || businesses.isFetching,
    hasLoaded: businesses.hasLoaded,
    token: auth.token,
  };
};

export default connect(mapStateToProps)(AppAuthenticated);
