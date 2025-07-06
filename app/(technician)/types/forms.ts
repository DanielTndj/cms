export interface AssignmentFormData {
  technicianIds: number[];
  locationId: string;
  title: string;
  description: string;
  date: string;
  priority: "low" | "medium" | "high" | "urgent";
  notes: string;
}

export interface TechnicianOption {
  value: number;
  label: string;
}