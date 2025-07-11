import { User, UserFormData } from "@settings/user/types/entities";
import { apiClient } from "@lib/api/client";
import { users } from "../../data/mockData";
import { USER_ROLES } from "@constants/user";

export class UserApiService {
  async getUsers(): Promise<User[]> {
    try {
      return apiClient.get('/users', users);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const user = users.find(u => u.id === id) || null;
      return apiClient.get(`/users/${id}`, user);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw new Error(`Failed to fetch user with id ${id}`);
    }
  }

  async createUser(data: UserFormData): Promise<User> {
    try {
      const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
      
      const newUser: User = {
        ...data,
        role: data.role as keyof typeof USER_ROLES, 
        id: maxId + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      users.push(newUser);
      
      return apiClient.post('/users', data, newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async updateUser(id: number, data: Partial<UserFormData>): Promise<User> {
    try {
      const existingUserIndex = users.findIndex(u => u.id === id);
      if (existingUserIndex === -1) {
        throw new Error(`User with id ${id} not found`);
      }
      
      const existingUser = users[existingUserIndex];
      const updatedUser: User = {
        ...existingUser,
        ...data,
        id,
        updatedAt: new Date(),
      };
      
      // Update in local array for simulation
      users[existingUserIndex] = updatedUser;
      
      return apiClient.put(`/users/${id}`, data, updatedUser);
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<User> {
    try {
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) {
        throw new Error(`User with id ${id} not found`);
      }
      
      const deletedUser = users[userIndex];
      
      // Remove from local array for simulation
      users.splice(userIndex, 1);
      
      // Fix: Return consistent type (User instead of success object)
      await apiClient.delete(`/users/${id}`, { success: true });
      return deletedUser;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}

export const userApi = new UserApiService();