import { ViewType } from "@technician/constants/views";
import { Assignment } from "./entities";
import { AssignmentFormData } from "./forms";

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
