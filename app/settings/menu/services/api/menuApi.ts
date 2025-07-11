import { MenuItem, MenuFormData } from "@settings/menu/types/entities";
import { apiClient } from "@lib/api/client";

export class MenuApiService {
  private menuItems: MenuItem[] = [];

  setMenuItems(items: MenuItem[]) {
    this.menuItems = items;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return apiClient.get('/menu-items', this.menuItems);
  }

  async getMenuItemById(id: number): Promise<MenuItem | null> {
    const menuItem = this.findMenuItemById(this.menuItems, id);
    return apiClient.get(`/menu-items/${id}`, menuItem);
  }

  async createMenuItem(data: MenuFormData): Promise<MenuItem> {
    // Convert parentId from string to number if it exists
    const parentId = data.parentId ? parseInt(data.parentId, 10) : undefined;
    
    const newMenuItem: MenuItem = {
      ...data,
      id: Math.max(...this.getAllMenuIds(this.menuItems), 0) + 1,
      parentId, // Use the converted number value
      order: parentId ? this.getNextChildOrder(this.menuItems, parentId) : this.getNextRootOrder(this.menuItems),
    };
    
    // Data akan dikelola oleh DataContext, tidak perlu update this.menuItems
    return apiClient.post('/menu-items', data, newMenuItem);
  }

  async updateMenuItem(id: number, data: Partial<MenuFormData>): Promise<MenuItem> {
    const itemIndex = this.menuItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      throw new Error(`Menu item with id ${id} not found`);
    }
    
    // Extract parentId and convert it, then create clean data object
    const { parentId, userCustomPermissions, ...restData } = data;
    
    const updatedMenuItem: MenuItem = {
      ...this.menuItems[itemIndex],
      ...restData, // Spread the rest of the data (excluding parentId)
      id,
      // Explicitly handle parentId conversion
      parentId: parentId ? parseInt(parentId, 10) : undefined,
    };
    
    // Data akan dikelola oleh DataContext, tidak perlu update this.menuItems
    return apiClient.put(`/menu-items/${id}`, data, updatedMenuItem);
  }

  async deleteMenuItem(id: number): Promise<{ success: boolean; message: string }> {
    // Data akan dikelola oleh DataContext, tidak perlu update this.menuItems
    
    const response = {
      success: true,
      message: `Menu item with id ${id} deleted successfully`
    };
    return apiClient.delete(`/menu-items/${id}`, response);
  }

  // Helper methods
  private findMenuItemById(items: MenuItem[], id: number): MenuItem | null {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = this.findMenuItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  private getAllMenuIds(items: MenuItem[]): number[] {
    const ids: number[] = [];
    for (const item of items) {
      ids.push(item.id);
      if (item.children) {
        ids.push(...this.getAllMenuIds(item.children));
      }
    }
    return ids;
  }

  private getNextRootOrder(items: MenuItem[]): number {
    const rootItems = items.filter(item => !item.parentId);
    return rootItems.length > 0 ? Math.max(...rootItems.map(item => item.order)) + 1 : 1;
  }

  private getNextChildOrder(items: MenuItem[], parentId: number): number {
    const childItems = items.filter(item => item.parentId === parentId);
    return childItems.length > 0 ? Math.max(...childItems.map(item => item.order)) + 1 : 1;
  }

  private removeMenuItemAndChildren(items: MenuItem[], id: number): MenuItem[] {
    return items.filter(item => {
      if (item.id === id) return false;
      if (item.parentId === id) return false;
      return true;
    });
  }
}

export const menuApi = new MenuApiService();