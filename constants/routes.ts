export const ROUTES = {
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  SETTINGS_USER: '/settings/user',
  SETTINGS_MENU: '/settings/menu',
  PUMP_MAINTENANCE: '/pump-maintenance',
} as const;

export type RouteKeys = keyof typeof ROUTES;