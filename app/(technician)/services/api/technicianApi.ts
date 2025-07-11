import { Technician } from "@technician/types";
import { apiClient } from "@lib/api/client";
import { technicians } from "@technician/data/mockData";

export class TechnicianApiService {
  // GET /api/technicians
  async getTechnicians(): Promise<Technician[]> {
    return apiClient.get('/technicians', technicians);
  }

  // GET /api/technicians/:id
  async getTechnicianById(id: number): Promise<Technician | null> {
    const technician = technicians.find(t => t.id === id) || null;
    return apiClient.get(`/technicians/${id}`, technician);
  }

  // POST /api/technicians
  async createTechnician(data: Omit<Technician, 'id'>): Promise<Technician> {
    const newTechnician: Technician = {
      ...data,
      id: Math.max(...technicians.map(t => t.id)) + 1
    };
    return apiClient.post('/technicians', data, newTechnician);
  }

  // PUT /api/technicians/:id
  async updateTechnician(id: number, data: Partial<Technician>): Promise<Technician> {
    const existingTechnician = technicians.find(t => t.id === id);
    if (!existingTechnician) {
      throw new Error(`Technician with id ${id} not found`);
    }
    
    const updatedTechnician: Technician = {
      ...existingTechnician,
      ...data,
      id // Ensure ID doesn't change
    };
    
    return apiClient.put(`/technicians/${id}`, data, updatedTechnician);
  }

  // DELETE /api/technicians/:id
  async deleteTechnician(id: number): Promise<{ success: boolean; message: string }> {
    const response = {
      success: true,
      message: `Technician with id ${id} deleted successfully`
    };
    return apiClient.delete(`/technicians/${id}`, response);
  }
}

export const technicianApi = new TechnicianApiService();