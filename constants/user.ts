export const USER_ROLES = {
  admin: 'Administrator',
  editor: 'Editor',
  viewer: 'Viewer'
} as const;

export const USER_STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended'
} as const;

export const USER_STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800'
} as const;