// @flow
export const NAV_ACTIVE: 'NAV_ACTIVE' = 'NAV_ACTIVE';
export const NAV_TOGGLE: 'NAV_TOGGLE' = 'NAV_TOGGLE';
export const NAV_RESPONSIVE: 'NAV_RESPONSIVE' = 'NAV_RESPONSIVE';

export type Responsive =
   | 'single'
   | 'multiple'

type NavActiveAction = {
  type: typeof NAV_ACTIVE,
  active: boolean,
};

type NavToggleAction = {
  type: typeof NAV_TOGGLE,
};

type NavResponsiveAction = {
  type: typeof NAV_RESPONSIVE,
  responsive: Responsive,
};

export type Action = NavActiveAction | NavToggleAction | NavResponsiveAction;

export const navActivate = (active: boolean): NavActiveAction => {
  return {type: NAV_ACTIVE, active};
};

export const navToggle = (): NavToggleAction => {
  return {type: NAV_TOGGLE};
};

export function navResponsive(responsive: Responsive): NavResponsiveAction {
  return {type: NAV_RESPONSIVE, responsive: responsive};
}
