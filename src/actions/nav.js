export const NAV_ACTIVE = 'NAV_ACTIVE'
export const NAV_TOGGLE = 'NAV_TOGGLE'
export const NAV_RESPONSIVE = 'NAV_RESPONSIVE'

export function navActivate (active) {
  return { type: NAV_ACTIVE, active: active }
}

export function navToggle (active) {
  return { type: NAV_TOGGLE }
}

export function navResponsive (responsive) {
  return { type: NAV_RESPONSIVE, responsive: responsive }
}
