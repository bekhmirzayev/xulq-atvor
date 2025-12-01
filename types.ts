export interface Incident {
  id: string;
  student: string;
  staff: string;
  reason: string;
  type: 'Ijobiy' | 'Salbiy';
  score: number;
  date: string;
  comment: string;
  dateObj?: Date; // Parsed date for sorting/charting
}

export interface StudentStat {
  name: string;
  totalIncidents: number;
  totalScore: number;
  negativeCount: number;
  positiveCount: number;
  incidents: Incident[];
}

export interface StaffStat {
  name: string;
  reportsCount: number;
  negativeReports: number;
  positiveReports: number;
}
