import { apiClient } from "./client";

export abstract class BaseApiService<T> {
  protected endpoint: string;
  protected mockData: T[];

  constructor(endpoint: string, mockData: T[]) {
    this.endpoint = endpoint;
    this.mockData = mockData;
  }

  async getAll(): Promise<T[]> {
    return apiClient.get(this.endpoint, this.mockData);
  }

  async getById(id: number): Promise<T | null> {
    const item = this.mockData.find((item: any) => item.id === id) || null;
    return apiClient.get(`${this.endpoint}/${id}`, item);
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const newItem: T = {
      ...data,
      id: Math.max(...this.mockData.map((item: any) => item.id)) + 1
    } as T;
    return apiClient.post(this.endpoint, data, newItem);
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    const existingItem = this.mockData.find((item: any) => item.id === id);
    if (!existingItem) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    const updatedItem: T = {
      ...existingItem,
      ...data,
      id
    } as T;
    
    return apiClient.put(`${this.endpoint}/${id}`, data, updatedItem);
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = {
      success: true,
      message: `Item with id ${id} deleted successfully`
    };
    return apiClient.delete(`${this.endpoint}/${id}`, response);
  }
}