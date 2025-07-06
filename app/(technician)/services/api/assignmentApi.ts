import { Assignment, AssignmentFormData } from "@technician/types";
import { apiClient } from "./client";
import { sampleAssignments } from "@technician/data/mockData";

export class AssignmentApiService {
  // GET /api/assignments
  async getAssignments(): Promise<Assignment[]> {
    return apiClient.get('/assignments', sampleAssignments);
  }

  // GET /api/assignments/:id
  async getAssignmentById(id: number): Promise<Assignment | null> {
    const assignment = sampleAssignments.find(a => a.id === id) || null;
    return apiClient.get(`/assignments/${id}`, assignment);
  }

  // GET /api/assignments/date/:date
  async getAssignmentsByDate(date: string): Promise<Assignment[]> {
    const targetDate = new Date(date);
    const assignmentsForDate = sampleAssignments.filter(assignment => {
      const assignmentDate = new Date(assignment.date);
      return assignmentDate.toDateString() === targetDate.toDateString();
    });
    return apiClient.get(`/assignments/date/${date}`, assignmentsForDate);
  }

  // POST /api/assignments
  async createAssignment(data: AssignmentFormData): Promise<Assignment> {
    const newAssignment: Assignment = {
      id: Math.max(...sampleAssignments.map(a => a.id)) + 1,
      technicianIds: data.technicianIds,
      locationId: parseInt(data.locationId),
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      status: "scheduled",
      priority: data.priority,
      notes: data.notes
    };
    return apiClient.post('/assignments', data, newAssignment);
  }

  // PUT /api/assignments/:id
  async updateAssignment(id: number, data: Partial<Assignment>): Promise<Assignment> {
    const existingAssignment = sampleAssignments.find(a => a.id === id);
    if (!existingAssignment) {
      throw new Error(`Assignment with id ${id} not found`);
    }
    
    const updatedAssignment: Assignment = {
      ...existingAssignment,
      ...data,
      id
    };
    
    return apiClient.put(`/assignments/${id}`, data, updatedAssignment);
  }

  // PATCH /api/assignments/:id/status
  async updateAssignmentStatus(id: number, status: Assignment['status']): Promise<Assignment> {
    return this.updateAssignment(id, { status });
  }

  // DELETE /api/assignments/:id
  async deleteAssignment(id: number): Promise<{ success: boolean; message: string }> {
    const response = {
      success: true,
      message: `Assignment with id ${id} deleted successfully`
    };
    return apiClient.delete(`/assignments/${id}`, response);
  }
}

export const assignmentApi = new AssignmentApiService();