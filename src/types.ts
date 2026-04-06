export type Role =
  | 'Admin'
  | 'Doctor'
  | 'Nurse'
  | 'Receptionist'
  | 'Pharmacist'
  | 'Lab Technician'
  | 'Radiologist'
  | 'Accountant'
  | 'Patient'
  | 'Vendor';

export type ModuleCard = {
  key: string;
  title: string;
  phase: string;
  description: string;
  status: string;
  audience: string;
};

export type Patient = {
  id: number;
  mrn: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  blood_group?: string | null;
  allergies?: string;
  insurance_provider?: string | null;
  portal_access: boolean;
};

export type Appointment = {
  id: number;
  patient_id: number;
  doctor_id: number;
  department: string;
  reason: string;
  start_time: string;
  end_time: string;
  status: string;
  slot_code?: string | null;
  location?: string | null;
};

export type DoctorOption = {
  id: number;
  full_name: string;
  department?: string | null;
  specialization?: string | null;
  bio?: string | null;
};

export type ClinicalRecord = {
  id: number;
  patient_id: number;
  author_id: number;
  encounter_type: string;
  diagnosis: string;
  treatment_plan: string;
  prescriptions: string;
  decrypted_clinical_notes?: string | null;
  document_url?: string | null;
  created_at: string;
};

export type Invoice = {
  id: number;
  invoice_number: string;
  patient_id: number;
  subtotal: number;
  tax: number;
  total: number;
  balance_due: number;
  status: string;
  insurance_provider?: string | null;
  notes?: string | null;
};

export type Payment = {
  id: number;
  invoice_id: number;
  amount: number;
  method: string;
  transaction_reference?: string | null;
  received_by_id?: number | null;
  paid_at: string;
};

export type InventoryItem = {
  id: number;
  sku: string;
  name: string;
  category: string;
  quantity_on_hand: number;
  reorder_level: number;
  unit_cost: number;
  location?: string | null;
  supplier?: string | null;
  expiry_date?: string | null;
};

export type LabOrder = {
  id: number;
  order_number: string;
  patient_id: number;
  requested_by_id: number;
  test_name: string;
  specimen?: string | null;
  priority: string;
  status: string;
  result_summary?: string | null;
  result_value?: string | null;
  reference_range?: string | null;
  result_file_url?: string | null;
  completed_at?: string | null;
  created_at: string;
};

export type OperationalSnapshot = {
  id: string;
  title: string;
  description: string;
  status: string;
};

export type DashboardStats = {
  patients: number;
  staff: number;
  appointments_today: number;
  revenue_this_month: number;
  pending_lab_orders: number;
  critical_alerts: number;
};

export type DashboardPayload = {
  stats: DashboardStats;
  recent_patients: Patient[];
  recent_appointments: Appointment[];
  alerts: Array<{ id: number; title: string; message: string; priority: string; created_at: string }>;
};

export type AuthToken = {
  access_token: string;
  token_type: string;
};

export type UserProfile = {
  id: number;
  full_name: string;
  email: string;
  role: Role;
  phone?: string | null;
};