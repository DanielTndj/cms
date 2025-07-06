export const STATUS_COLORS = {
  scheduled: "border-l-blue-500",
  "in-progress": "border-l-orange-500",
  completed: "border-l-green-500",
  cancelled: "border-l-gray-500",
} as const;

export const STATUS_LABELS = {
  scheduled: "Terjadwal",
  "in-progress": "Sedang Berlangsung", 
  completed: "Selesai",
  cancelled: "Dibatalkan",
} as const;