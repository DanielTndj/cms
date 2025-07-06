import { Assignment } from "./entities";

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
  handleEdit?: (assignment: Assignment) => void;
}