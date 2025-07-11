import { useState } from 'react';
import { User, UserFormData } from '../types/entities';
import { userApi } from '../services/api/userApi';
import { useDataContext } from '@lib/context/DataContext'; // Tambahkan ini
import { toast } from 'sonner';

export function useUserManagement() {
  // Gunakan DataContext untuk konsistensi
  const { users, addUser, updateUser, removeUser } = useDataContext();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (data: UserFormData) => {
    try {
      setLoading(true);
      const newUser = await userApi.createUser(data);
      addUser(newUser); // Update DataContext
      toast.success('User berhasil dibuat');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Gagal membuat user');
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id: number, data: Partial<UserFormData>) => {
    try {
      setLoading(true);
      const updatedUser = await userApi.updateUser(id, data);
      updateUser(id, updatedUser); // Update DataContext
      toast.success('User berhasil diupdate');
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Gagal mengupdate user');
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      setLoading(true);
      await userApi.deleteUser(id);
      removeUser(id); // Update DataContext
      toast.success('User berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus user');
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  const handleSubmit = async (data: UserFormData) => {
    if (isEditing && selectedUser) {
      await handleUpdateUser(selectedUser.id, data);
    } else {
      await handleCreateUser(data);
    }
  };

  return {
    users, // Dari DataContext
    loading,
    error: null,
    selectedUser,
    isModalOpen,
    isEditing,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleSubmit,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}