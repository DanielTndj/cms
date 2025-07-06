export interface Technician {
  id: number;
  name: string;
  phone: string;
  skill: string;
  status: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  type: string;
}

export interface Assignment {
  id: number;
  technicianIds: number[];
  locationId: number;
  title: string;
  description: string;
  date: Date;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  notes?: string;
}
