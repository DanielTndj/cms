import { useState, useEffect } from 'react';
import { MenuItem } from '@settings/menu/types/entities';
import { menuApi } from '@settings/menu/services/api/menuApi';
import { useCallback } from 'react';
import { useDataContext } from '@lib/context/DataContext';

export function useMenuData() {
  const { menuItems } = useDataContext();

  // Separate parent and child menus
  const parentMenus = menuItems.filter(item => !item.parentId);
  const getChildMenus = useCallback((parentId: number) => 
    menuItems.filter(item => item.parentId === parentId), [menuItems]);

  return {
    menuItems,
    parentMenus,
    getChildMenus,
    loading: false, // No async loading needed
    error: null,
  };
}