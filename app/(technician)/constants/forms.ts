export const DEFAULT_FORM_DATA = {
  technicianIds: [] as number[],
  locationId: "",
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  priority: "medium" as const,
  notes: "",
};