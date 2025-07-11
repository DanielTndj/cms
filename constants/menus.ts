import { MenuItem } from '@/app/settings/menu/types/entities'

// Import dari mock data yang sudah ada
import { menuItems } from '@/app/settings/menu/data/mockData'

// Pisahkan parent dan child menus
export const parentMenus: MenuItem[] = menuItems.filter(item => !item.parentId)
export const childMenus: MenuItem[] = menuItems.filter(item => item.parentId)