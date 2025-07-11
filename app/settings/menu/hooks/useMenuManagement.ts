import { useState, useEffect } from 'react';
import { MenuItem, MenuFormData } from '../types/entities';
import { menuApi } from '../services/api/menuApi';
import { useDataContext } from '@lib/context/DataContext';
import { toast } from 'sonner';

export function useMenuManagement() {
  const { menuItems, addMenuItem, updateMenuItem, removeMenuItem, refreshMenuData } = useDataContext();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync menuApi with context data
  useEffect(() => {
    menuApi.setMenuItems(menuItems);
  }, [menuItems]);

  const handleCreateMenuItem = async (data: MenuFormData) => {
    try {
      setLoading(true);
      const newMenuItem = await menuApi.createMenuItem(data);
      addMenuItem(newMenuItem);
      toast.success('Menu item created successfully');
      setIsModalOpen(false);
      refreshMenuData(); // Trigger refresh for user settings
    } catch (error) {
      toast.error('Failed to create menu item');
      console.error('Error creating menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMenuItem = async (id: number, data: Partial<MenuFormData>) => {
    try {
      setLoading(true);
      const updatedMenuItem = await menuApi.updateMenuItem(id, data);
      updateMenuItem(id, updatedMenuItem);
      toast.success('Menu item updated successfully');
      setIsModalOpen(false);
      setSelectedMenuItem(undefined);
      refreshMenuData(); // Trigger refresh for user settings
    } catch (error) {
      toast.error('Failed to update menu item');
      console.error('Error updating menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    try {
      setLoading(true);
      await menuApi.deleteMenuItem(id);
      removeMenuItem(id);
      toast.success('Menu item deleted successfully');
      refreshMenuData(); // Trigger refresh for user settings
    } catch (error) {
      toast.error('Failed to delete menu item');
      console.error('Error deleting menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedMenuItem(undefined);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMenuItem(undefined);
    setIsEditing(false);
  };

  const handleSubmit = async (data: MenuFormData) => {
    if (isEditing && selectedMenuItem) {
      await handleUpdateMenuItem(selectedMenuItem.id, data);
    } else {
      await handleCreateMenuItem(data);
    }
  };

  return {
    menuItems,
    loading,
    selectedMenuItem,
    isModalOpen,
    isEditing,
    setIsModalOpen,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDeleteMenuItem,
  };
}