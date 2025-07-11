import { useState } from 'react';
import { Technician } from '../types/entities';
import { technicianApi } from '../services/api/technicianApi';
import { useApi } from '@hooks/useApi';
import { toast } from 'sonner';

export interface TechnicianFormData {
  name: string;
  phone: string;
  skill: string;
  status: string;
}

export function useTechnicianManagement() {
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: technicians, loading, error, refetch } = useApi(
    () => technicianApi.getTechnicians(),
    [],
    {
      onSuccess: (data) => console.log('Technicians loaded:', data.length),
      onError: (error) => toast.error('Failed to load technicians')
    }
  );

  const handleCreateTechnician = async (data: TechnicianFormData) => {
    try {
      await technicianApi.createTechnician(data);
      toast.success('Technician berhasil dibuat');
      refetch();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Gagal membuat technician');
      console.error('Error creating technician:', error);
    }
  };

  const handleUpdateTechnician = async (id: number, data: Partial<TechnicianFormData>) => {
    try {
      await technicianApi.updateTechnician(id, data);
      toast.success('Technician berhasil diupdate');
      refetch();
      setIsModalOpen(false);
      setSelectedTechnician(null);
    } catch (error) {
      toast.error('Gagal mengupdate technician');
      console.error('Error updating technician:', error);
    }
  };

  const handleDeleteTechnician = async (id: number) => {
    try {
      await technicianApi.deleteTechnician(id);
      toast.success('Technician berhasil dihapus');
      refetch();
    } catch (error) {
      toast.error('Gagal menghapus technician');
      console.error('Error deleting technician:', error);
    }
  };

  const openCreateModal = () => {
    setSelectedTechnician(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (technician: Technician) => {
    setSelectedTechnician(technician);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTechnician(null);
    setIsEditing(false);
  };

  const handleSubmit = async (data: TechnicianFormData) => {
    if (isEditing && selectedTechnician) {
      await handleUpdateTechnician(selectedTechnician.id, data);
    } else {
      await handleCreateTechnician(data);
    }
  };

  return {
    // Data
    technicians: technicians || [],
    loading,
    error,
    selectedTechnician,
    isModalOpen,
    isEditing,
    
    // Actions
    handleCreateTechnician,
    handleUpdateTechnician,
    handleDeleteTechnician,
    handleSubmit,
    
    // Modal controls
    openCreateModal,
    openEditModal,
    closeModal,
    
    // Utilities
    refetch
  };
}