export const NAV_ENABLE = 'NAV_ENABLE'
export const NAV_ACTIVE = 'NAV_ACTIVE'
export const NAV_TOGGLE = 'NAV_TOGGLE'

export function navEnable (enabled) {
  return { type: NAV_ENABLE, enabled: enabled }
}

export function navActivate (active) {
  return { type: NAV_ACTIVE, active: active }
}

export function navToggle (active) {
  return { type: NAV_TOGGLE }
}
