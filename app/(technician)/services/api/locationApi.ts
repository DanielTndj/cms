import { Location } from "@technician/types";
import { apiClient } from "@lib/api/client";
import { locations } from "@technician/data/mockData";

export class LocationApiService {
  // GET /api/locations
  async getLocations(): Promise<Location[]> {
    return apiClient.get('/locations', locations);
  }

  // GET /api/locations/:id
  async getLocationById(id: number): Promise<Location | null> {
    const location = locations.find(l => l.id === id) || null;
    return apiClient.get(`/locations/${id}`, location);
  }

  // POST /api/locations
  async createLocation(data: Omit<Location, 'id'>): Promise<Location> {
    const newLocation: Location = {
      ...data,
      id: Math.max(...locations.map(l => l.id)) + 1
    };
    return apiClient.post('/locations', data, newLocation);
  }

  // PUT /api/locations/:id
  async updateLocation(id: number, data: Partial<Location>): Promise<Location> {
    const existingLocation = locations.find(l => l.id === id);
    if (!existingLocation) {
      throw new Error(`Location with id ${id} not found`);
    }
    
    const updatedLocation: Location = {
      ...existingLocation,
      ...data,
      id
    };
    
    return apiClient.put(`/locations/${id}`, data, updatedLocation);
  }

  // DELETE /api/locations/:id
  async deleteLocation(id: number): Promise<{ success: boolean; message: string }> {
    const response = {
      success: true,
      message: `Location with id ${id} deleted successfully`
    };
    return apiClient.delete(`/locations/${id}`, response);
  }
}

export const locationApi = new LocationApiService();