export const MENU_ICONS = [
  { value: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { value: "users", label: "Users", icon: "Users" },
  { value: "settings", label: "Settings", icon: "Settings" },
  { value: "pump", label: "Pump Maintenance", icon: "Wrench" },
] as const;

export const MENU_STATUS_COLORS = {
  visible: "bg-green-100 text-green-800",
  hidden: "bg-gray-100 text-gray-800",
} as const;