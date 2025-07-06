import { Assignment, Technician, Location, TechnicianOption } from "@technician/types";

// Date formatting helper
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Check if two dates are the same day
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

// Get assignments for a specific date
export const getAssignmentsForDate = (assignments: Assignment[], date: Date): Assignment[] => {
  return assignments.filter((assignment) => isSameDay(assignment.date, date));
};

// Find technician by ID
export const getTechnicianById = (technicians: Technician[], id: number): Technician | undefined => {
  return technicians.find((t) => t.id === id);
};

// Find location by ID
export const getLocationById = (locations: Location[], id: number): Location | undefined => {
  return locations.find((l) => l.id === id);
};

// Convert technicians to select options
export const getTechnicianOptions = (technicians: Technician[]): TechnicianOption[] => {
  return technicians.map((tech) => ({
    value: tech.id,
    label: `${tech.name} - ${tech.skill}`,
  }));
};

// Generate calendar days for month view
export const generateCalendarDays = (currentDate: Date): Date[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const current = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

// Generate week days for week view
export const generateWeekDays = (currentDate: Date): Date[] => {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  return days;
};

// Get view title based on current date and view type
export const getViewTitle = (currentDate: Date, viewType: string): string => {
  if (viewType === "month") {
    return currentDate.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  } else if (viewType === "week") {
    const weekDays = generateWeekDays(currentDate);
    const start = weekDays[0].toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    const end = weekDays[6].toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${start} - ${end}`;
  } else {
    return formatDate(currentDate);
  }
};

// Generate next assignment ID
export const getNextAssignmentId = (assignments: Assignment[]): number => {
  return Math.max(...assignments.map((a) => a.id), 0) + 1;
};