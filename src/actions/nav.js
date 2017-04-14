// @flow
export const NAV_ACTIVE: 'NAV_ACTIVE' = 'NAV_ACTIVE'
export const NAV_TOGGLE: 'NAV_TOGGLE' = 'NAV_TOGGLE'
export const NAV_RESPONSIVE: 'NAV_RESPONSIVE' = 'NAV_RESPONSIVE'

type NavActiveAction = {
  type: typeof NAV_ACTIVE,
  active: boolean
}

type NavToggleAction = {
  type: typeof NAV_TOGGLE
}

type NavResponsiveAction = {
  type: typeof NAV_RESPONSIVE,
  responsive: 'multiple'
}

export type Action =
  | NavActiveAction
  | NavToggleAction
  | NavResponsiveAction

export const navActivate = (active: boolean): NavActiveAction => {
  return { type: NAV_ACTIVE, active }
}

export const navToggle = (active: boolean): NavToggleAction => {
  return { type: NAV_TOGGLE }
}

export function navResponsive (responsive: 'multiple'): NavResponsiveAction {
  return { type: NAV_RESPONSIVE, responsive: responsive }
}
