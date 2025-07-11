export interface MenuItem {
  id: number;
  title: string;
  path: string;
  icon: string;
  parentId?: number;
  order: number;
  isVisible: boolean;
  permissions: string[];
  children?: MenuItem[];
}

export interface MenuFormData {
  title: string;
  path: string;
  icon: string;
  parentId?: string | undefined; // Ubah dari number | null | undefined ke string | undefined
  order: number; 
  isVisible: boolean;
  permissions: string[]; // Template permissions
  userCustomPermissions?: string[]; // User-defined custom permissions (opsional)
}