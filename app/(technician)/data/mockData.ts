import { Technician, Location, Assignment } from "@technician/types";

export const technicians: Technician[] = [
  {
    id: 1,
    name: "Ahmad Rahman",
    phone: "081234567890",
    skill: "Service Pompa",
    status: "active",
  },
  {
    id: 2,
    name: "Budi Santoso",
    phone: "081234567891",
    skill: "Pasang Pompa",
    status: "active",
  },
  {
    id: 3,
    name: "Citra Dewi",
    phone: "081234567892",
    skill: "Perbaikan Listrik",
    status: "active",
  },
];

export const locations: Location[] = [
  {
    id: 1,
    name: "Mall Taman Anggrek",
    address: "Jl. S. Parman, Jakarta Barat",
    type: "Mall",
  },
  {
    id: 2,
    name: "Hotel Grand Hyatt",
    address: "Jl. MH Thamrin, Jakarta Pusat",
    type: "Hotel",
  },
  {
    id: 3,
    name: "Office Tower Kuningan",
    address: "Jl. HR Rasuna Said, Jakarta Selatan",
    type: "Office",
  },
];

export const sampleAssignments: Assignment[] = [
  {
    id: 1,
    technicianIds: [1, 2],
    locationId: 1,
    title: "Pasang Pompa",
    description: "Pasang pompa air baru",
    date: new Date(2025, 5, 30),
    status: "scheduled",
    priority: "medium",
    notes: "Pompa air merk Grundfos",
  },
  {
    id: 2,
    technicianIds: [1],
    locationId: 2,
    title: "Service pompa",
    description: "Service pompa air",
    date: new Date(2025, 5, 30),
    status: "scheduled",
    priority: "high",
    notes: "Pompa sering mati",
  },
];