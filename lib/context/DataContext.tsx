'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { MenuItem } from '@settings/menu/types/entities';
import { User } from '@settings/user/types/entities';
import { menuItems as initialMenuItems } from '@settings/menu/data/mockData';
import { users as initialUsers } from '@settings/user/data/mockData';

interface DataContextType {
  // Menu data
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  updateMenuItem: (id: number, updates: Partial<MenuItem>) => void;
  addMenuItem: (item: MenuItem) => void;
  removeMenuItem: (id: number) => void;
  
  // User data
  users: User[];
  setUsers: (users: User[]) => void;
  updateUser: (id: number, updates: Partial<User>) => void;
  addUser: (user: User) => void;
  removeUser: (id: number) => void;
  
  // Refresh functions
  refreshMenuData: () => void;
  refreshUserData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Menu operations
  const updateMenuItem = useCallback((id: number, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const addMenuItem = useCallback((item: MenuItem) => {
    setMenuItems(prev => [...prev, item]);
  }, []);

  const removeMenuItem = useCallback((id: number) => {
    setMenuItems(prev => prev.filter(item => item.id !== id && item.parentId !== id));
  }, []);

  // User operations
  const updateUser = useCallback((id: number, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  }, []);

  const addUser = useCallback((user: User) => {
    setUsers(prev => [...prev, user]);
  }, []);

  const removeUser = useCallback((id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  }, []);

  // Refresh functions
  const refreshMenuData = useCallback(() => {
    // Trigger re-render for components that depend on menu data
    setMenuItems(prev => [...prev]);
  }, []);

  const refreshUserData = useCallback(() => {
    setUsers(prev => [...prev]);
  }, []);

  const value: DataContextType = {
    menuItems,
    setMenuItems,
    updateMenuItem,
    addMenuItem,
    removeMenuItem,
    users,
    setUsers,
    updateUser,
    addUser,
    removeUser,
    refreshMenuData,
    refreshUserData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
}