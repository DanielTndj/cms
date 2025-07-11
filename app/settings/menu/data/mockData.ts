import { MenuItem } from "../types/entities";

export const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
    order: 1,
    isVisible: true,
    permissions: ["view_dashboard"], // Dari setting menu
  },
  {
    id: 2,
    title: "Settings",
    path: "/settings",
    icon: "Settings",
    order: 2,
    isVisible: true,
    permissions: ["read_user", "read_menu"], // Basic read access
  },
  {
    id: 3,
    title: "User Management",
    path: "/settings/user",
    icon: "Users",
    parentId: 2,
    order: 1,
    isVisible: true,
    permissions: ["create_user", "read_user", "update_user", "delete_user", "export_data_user"], // Termasuk custom permission
  },
  {
    id: 4,
    title: "Menu Management",
    path: "/settings/menu",
    icon: "Menu",
    parentId: 2,
    order: 2,
    isVisible: true,
    permissions: ["create_menu", "read_menu", "update_menu", "delete_menu"],
  },
  {
    id: 5,
    title: "Technician",
    path: "/technician",
    icon: "Users",
    order: 3,
    isVisible: true,
    permissions: ["create_technician", "read_technician", "update_technician", "delete_technician", "approve_technician"],
  },
  {
    id: 6,
    title: "Pump Maintenance",
    path: "/pump-maintenance",
    icon: "Wrench",
    order: 4,
    isVisible: true,
    permissions: ["create_pump_maintenance", "read_pump_maintenance", "update_pump_maintenance", "delete_pump_maintenance", "upload_file_pump_maintenance"],
  },
];