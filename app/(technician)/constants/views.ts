export const VIEW_TYPES = {
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
} as const;

export type ViewType = (typeof VIEW_TYPES)[keyof typeof VIEW_TYPES];

export const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];