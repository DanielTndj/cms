
import { User } from '@settings/user/types/entities';

export const users: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    permissions: ["manage_users", "view_dashboard", "manage_menu"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
    phone: "081234567890",
  },
  {
    id: 2,
    name: "Editor User",
    email: "editor@example.com",
    role: "editor",
    status: "active",
    permissions: ["view_dashboard"],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-10"),
    phone: "081234567891",
  },
  {
    id: 3,
    name: "Viewer User",
    email: "viewer@example.com",
    role: "viewer",
    status: "inactive",
    permissions: ["view_dashboard"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
  },
];