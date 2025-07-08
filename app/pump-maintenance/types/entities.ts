export interface ServiceRequest {
  id: number;
  title: string;
  customer: string;
  location: string;
  serviceType: string;
  pumpType: string;
  workDate: string;
  technicianRecommendation: string;
  status: 'perlu-penugasan-teknisi' | 'dalam-pengerjaan' | 'dibatalkan' | 'selesai';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestDate: string;
  images?: string[];
  description?: string;
  contactPerson?: string;
  phoneNumber?: string;
  address?: string;
}

export interface PumpMaintenanceReport {
  id: number;
  serviceRequestId: number;
  technicianId: number;
  reportDate: string;
  problemDescription: string;
  solutionApplied: string;
  partsReplaced: string[];
  workDuration: number;
  customerSatisfaction: number;
  images: string[];
  technicalReadings: {
    l1: number;
    l2: number;
    l3: number;
    amperage: number;
    voltage: number;
  };
  recommendations: string;
  nextMaintenanceDate?: string;
}