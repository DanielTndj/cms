import { MenuItem } from '@settings/menu/types/entities';
import { User } from '@settings/user/types/entities';
import { menuItems } from '@settings/menu/data/mockData';
import { users } from '@settings/user/data/mockData';

export class LocalStorageService {
  private static getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch custom event for cross-component updates
      window.dispatchEvent(new CustomEvent('localStorageUpdate', {
        detail: { key, value }
      }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Menu Items Management
  static getMenuItems(): MenuItem[] {
    return this.getItem('menuItems', []);
  }

  static setMenuItems(items: MenuItem[]): void {
    this.setItem('menuItems', items);
  }

  // Users Management
  static getUsers(): User[] {
    return this.getItem('users', []);
  }

  static setUsers(users: User[]): void {
    this.setItem('users', users);
  }

  // Initialize data with mock data if empty
  static initializeData(): void {
    if (this.getMenuItems().length === 0) {
      this.setMenuItems(menuItems);
    }
    if (this.getUsers().length === 0) {
      this.setUsers(users);
    }
  }

  // Clear all data (for development/testing)
  static clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('menuItems');
    localStorage.removeItem('users');
  }
}