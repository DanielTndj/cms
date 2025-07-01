// Calendar view types
export const VIEW_TYPES = {
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
} as const;

export type ViewType = (typeof VIEW_TYPES)[keyof typeof VIEW_TYPES];

// Priority colors mapping
export const PRIORITY_COLORS = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
} as const;

// Status colors mapping
export const STATUS_COLORS = {
  scheduled: "border-l-blue-500",
  "in-progress": "border-l-orange-500",
  completed: "border-l-green-500",
  cancelled: "border-l-gray-500",
} as const;

// Status labels in Indonesian
export const STATUS_LABELS = {
  scheduled: "Terjadwal",
  "in-progress": "Sedang Berlangsung", 
  completed: "Selesai",
  cancelled: "Dibatalkan",
} as const;

// Priority labels in Indonesian
export const PRIORITY_LABELS = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi", 
  urgent: "Mendesak",
} as const;

// Days of week in Indonesian
export const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// Default form data
export const DEFAULT_FORM_DATA = {
  technicianIds: [] as number[],
  locationId: "",
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  priority: "medium" as const,
  notes: "",
};