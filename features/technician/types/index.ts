import { ViewType } from "../constants/technicianConstant";

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

export interface AssignmentModalProps {
  showModal: boolean;
  modalMode: "create" | "edit" | "view";
  selectedAssignment: Assignment | null;
  formData: AssignmentFormData; 
  technicians: any[];
  locations: any[];
  technicianOptions: any[];
  handleInputChange: (field: string, value: any) => void;
  handleSave: () => void;
  handleDelete: (id: number) => void;
  handleEdit: (assignment: Assignment) => void;
  handleStatusChange: (id: number, status: Assignment["status"]) => void;
  handleCloseModal: () => void;
}

export interface DayViewProps {
  currentDate: Date;
  getAssignmentsForDate: (date: Date) => Assignment[];
  locations: any[];
  technicians: any[];
  handleView: (assignment: Assignment) => void;
}

export interface WeekViewProps {
  calendarDays: Date[];
  getAssignmentsForDate: (date: Date) => Assignment[];
  technicians: any[];
  handleView: (assignment: Assignment) => void;
}

export interface MonthViewProps {
  calendarDays: Date[];
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  getAssignmentsForDate: (date: Date) => Assignment[];
  technicians: any[];
  handleCreate: (date: Date) => void;
  handleView: (assignment: Assignment) => void;
}

export interface CalendarHeaderProps {
  view: ViewType;
  setView: (view: ViewType) => void;
  goToPrevious: () => void;
  goToNext: () => void;
  goToToday: () => void;
  getViewTitle: () => string;
  handleCreate: (date: Date) => void;
}

export interface StatsCardsProps {
  assignments: Assignment[];
}