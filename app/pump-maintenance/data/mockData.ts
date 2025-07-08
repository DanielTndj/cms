import { ServiceRequest } from '../types/entities';

export const serviceRequests: ServiceRequest[] = [
  {
    id: 1,
    title: "Service Pompa CV Mataram Mulia",
    customer: "CV Mataram Mulia",
    location: "Jl. Industri Raya No. 123, Kel. Sukamaju, Kota Madiun, Jawa Timur 63119",
    serviceType: "Service",
    pumpType: "Grundfos",
    workDate: "Belum ditentukan",
    technicianRecommendation: "Felix Alexander",
    status: "perlu-penugasan-teknisi",
    priority: "high",
    requestDate: "28-06-2025 16:31:23",
    contactPerson: "Budi Santoso",
    phoneNumber: "0812 3456 7890",
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    description: "Pompa mengalami penurunan performa dan mengeluarkan suara tidak normal"
  },
  {
    id: 2,
    title: "Pompa Hotel CV XYZ",
    customer: "Hotel CV XYZ",
    location: "Jl. Pariwisata No. 45, Jakarta",
    serviceType: "Service",
    pumpType: "Deep well SP, Transfer CR",
    workDate: "Belum ditentukan",
    technicianRecommendation: "Tidak Ada",
    status: "perlu-penugasan-teknisi",
    priority: "medium",
    requestDate: "23-06-2025 16:31:23",
    contactPerson: "Sari Dewi",
    phoneNumber: "0813 4567 8901",
    images: ["/api/placeholder/400/300"]
  },
  {
    id: 3,
    title: "Pompa Industri Pabrik PT ABC",
    customer: "PT ABC",
    location: "Kawasan Industri Cikarang",
    serviceType: "Supervisi",
    pumpType: "Deep well SP, Transfer CR",
    workDate: "13-08-2025",
    technicianRecommendation: "Tidak Ada",
    status: "dalam-pengerjaan",
    priority: "urgent",
    requestDate: "23-06-2025 16:31:23",
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300"]
  },
  {
    id: 4,
    title: "Service Pompa CV ABC",
    customer: "CV ABC",
    location: "Surabaya",
    serviceType: "Supervisi",
    pumpType: "Deep well SP, Transfer CR",
    workDate: "13-08-2025",
    technicianRecommendation: "Tidak Ada",
    status: "dibatalkan",
    priority: "low",
    requestDate: "23-06-2025 16:31:23",
    images: []
  },
  {
    id: 5,
    title: "Service Pompa BCD",
    customer: "PT BCD",
    location: "Bandung",
    serviceType: "Supervisi",
    pumpType: "Deep well SP, Transfer CR",
    workDate: "13-08-2025",
    technicianRecommendation: "Tidak Ada",
    status: "selesai",
    priority: "medium",
    requestDate: "23-06-2025 16:31:23",
    images: ["/api/placeholder/400/300"]
  }
];