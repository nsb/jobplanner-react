// @flow
import {NAV_ACTIVE, NAV_TOGGLE, NAV_RESPONSIVE} from '../actions/nav';
import type {Action, Responsive} from '../actions/nav';

type State = {
  active: boolean,
  responsive: Responsive,
};

const initialState: State = {
  active: true,
  responsive: 'multiple',
};

const navReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case NAV_ACTIVE:
      return Object.assign({}, state, {
        active: action.active,
      });

    case NAV_TOGGLE:
      return Object.assign({}, state, {
        active: !state.active,
      });

    case NAV_RESPONSIVE:
      return {
        ...state,
        responsive: action.responsive,
        active: action.responsive === 'multiple',
      };

    default:
      return state;
  }
};

export default navReducer;
