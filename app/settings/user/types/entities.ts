import { USER_ROLES, USER_STATUS_LABELS } from "@constants/user"
import { DateAfter } from "react-day-picker"

export interface User {
  id: number
  name: string
  email: string
  role: keyof typeof USER_ROLES
  status: keyof typeof USER_STATUS_LABELS
  permissions: string[]
  phone?: string
  menuAccess?: {
    parentMenus: number[]
    childMenus: number[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface UserFormData {
  name: string;
  email: string;
  role: keyof typeof USER_ROLES;
  status: keyof typeof USER_STATUS_LABELS;
  permissions: string[];
  phone?: string;
  menuAccess: {
    parentMenus: number[]; 
    childMenus: number[];
  };
}