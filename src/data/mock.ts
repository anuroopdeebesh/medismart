import type { Appointment, ClinicalRecord, DashboardPayload, DoctorOption, Invoice, InventoryItem, LabOrder, ModuleCard, OperationalSnapshot, Patient, Payment } from '../types';

export const demoToken = 'demo-token';

export const mockModules: ModuleCard[] = [
  { key: 'patients', title: 'Patient Management', phase: 'Phase 1', description: 'Registration, profiles, portal access, communications, and consent.', status: 'Implemented', audience: 'Front Desk, Patients, Doctors' },
  { key: 'appointments', title: 'Appointment & Scheduling', phase: 'Phase 1', description: 'Bookings, calendars, slot management, and live status updates.', status: 'Implemented', audience: 'Reception, Patients, Doctors' },
  { key: 'ehr', title: 'Electronic Health Records', phase: 'Phase 1', description: 'Clinical notes, encounters, prescriptions, and documents.', status: 'Implemented', audience: 'Doctors, Nurses' },
  { key: 'billing', title: 'Billing & Payments', phase: 'Phase 1', description: 'Invoices, payments, insurance coverage, and balances.', status: 'Implemented', audience: 'Accountants, Patients' },
  { key: 'inventory', title: 'Inventory & Pharmacy', phase: 'Phase 1', description: 'Stock tracking, pharmacy management, and reorder alerts.', status: 'Implemented', audience: 'Pharmacists, Vendors' },
  { key: 'staff', title: 'Staff & HR', phase: 'Phase 1', description: 'Employee profiles, shifts, credentials, and department coverage.', status: 'Implemented', audience: 'HR, Admin' },
  { key: 'lab', title: 'Laboratory', phase: 'Phase 2', description: 'Test orders, result release, and equipment tracking.', status: 'Demo Ready', audience: 'Lab Technicians, Doctors' },
  { key: 'radiology', title: 'Radiology', phase: 'Phase 2', description: 'Imaging requests, DICOM references, and reporting.', status: 'Demo Ready', audience: 'Radiologists' },
  { key: 'nursing', title: 'Nursing & Ward', phase: 'Phase 2', description: 'Bed allocation, tasks, and vital sign monitoring.', status: 'Demo Ready', audience: 'Nurses' },
  { key: 'surgery', title: 'Surgery & OT', phase: 'Phase 2', description: 'Operating theatre schedules, resources, and post-op notes.', status: 'Demo Ready', audience: 'Surgeons, Nurses' },
  { key: 'opd', title: 'Outpatient Department', phase: 'Phase 1', description: 'Consultation management and queue flow.', status: 'Demo Ready', audience: 'Reception, Doctors' },
  { key: 'ipd', title: 'Inpatient Department', phase: 'Phase 2', description: 'Admissions, ward rounds, and discharge workflows.', status: 'Demo Ready', audience: 'Ward Clerks, Nurses' },
  { key: 'emergency', title: 'Emergency Department', phase: 'Phase 2', description: 'Triage, critical care, and escalation protocols.', status: 'Demo Ready', audience: 'Emergency Staff' },
  { key: 'analytics', title: 'Analytics & Reporting', phase: 'Phase 1', description: 'Operational dashboards, financial summaries, and BI exports.', status: 'Implemented', audience: 'Leadership, Admin' },
  { key: 'telemedicine', title: 'Telemedicine', phase: 'Phase 2', description: 'Virtual consults, remote monitoring, and async follow-up.', status: 'Demo Ready', audience: 'Doctors, Patients' },
  { key: 'notifications', title: 'Notification & Alerts', phase: 'Phase 1', description: 'Critical alerts, reminders, and communication hub.', status: 'Implemented', audience: 'All Roles' },
  { key: 'security', title: 'Security & Compliance', phase: 'Phase 1', description: 'RBAC, audit logs, consent, export, and deletion workflows.', status: 'Implemented', audience: 'Admin, Compliance' },
  { key: 'feedback', title: 'Feedback & Surveys', phase: 'Phase 3', description: 'Patient and staff satisfaction, ratings, and sentiment capture.', status: 'Demo Ready', audience: 'All Roles' },
  { key: 'integrations', title: 'Integration Module', phase: 'Phase 3', description: 'FHIR-ready API design for external systems and vendors.', status: 'Planned', audience: 'Admin, IT' },
  { key: 'mobile', title: 'Mobile Applications', phase: 'Phase 2', description: 'Patient, doctor, and staff mobile experiences.', status: 'Planned', audience: 'Patients, Staff' },
];

export const mockPatients: Patient[] = [
  { id: 1, mrn: 'MRN-1001', full_name: 'Taylor Brooks', date_of_birth: '1988-05-14', gender: 'Female', phone: '+1-555-0700', email: 'taylor.brooks@medismart.local', address: '24 Elm Street', blood_group: 'A+', allergies: 'Penicillin', insurance_provider: 'Blue Horizon', portal_access: true },
  { id: 2, mrn: 'MRN-1002', full_name: 'Ethan Walsh', date_of_birth: '1979-11-02', gender: 'Male', phone: '+1-555-0711', email: 'ethan.walsh@example.com', address: '88 Lake Avenue', blood_group: 'O-', allergies: 'None', insurance_provider: 'MetroCare', portal_access: true },
  { id: 3, mrn: 'MRN-1003', full_name: 'Priya Nair', date_of_birth: '1993-02-23', gender: 'Female', phone: '+1-555-0722', email: 'priya.nair@example.com', address: '12 Cedar Road', blood_group: 'B+', allergies: 'Latex', insurance_provider: 'HealthFirst', portal_access: true },
];

export const mockAppointments: Appointment[] = [
  { id: 1, patient_id: 1, doctor_id: 2, department: 'Cardiology', reason: 'Annual review', start_time: '2026-04-02T10:00:00Z', end_time: '2026-04-02T10:30:00Z', status: 'Scheduled', slot_code: 'C-1201', location: 'Clinic 3' },
  { id: 2, patient_id: 2, doctor_id: 2, department: 'Cardiology', reason: 'Blood pressure review', start_time: '2026-04-02T12:00:00Z', end_time: '2026-04-02T12:20:00Z', status: 'Checked In', slot_code: 'C-1202', location: 'Clinic 2' },
  { id: 3, patient_id: 3, doctor_id: 2, department: 'Cardiology', reason: 'Lab review', start_time: '2026-04-01T09:00:00Z', end_time: '2026-04-01T09:30:00Z', status: 'Completed', slot_code: 'C-1203', location: 'Clinic 1' },
];

export const mockDoctors: DoctorOption[] = [
  { id: 2, full_name: 'Dr. Noor Khan', department: 'Cardiology', specialization: 'Cardiology', bio: 'Heart care specialist with a focus on preventive cardiology and follow-up planning.' },
  { id: 8, full_name: 'Dr. Elena Park', department: 'General Medicine', specialization: 'Internal Medicine', bio: 'Primary care physician with strong experience in chronic disease management.' },
  { id: 9, full_name: 'Dr. Arjun Mehta', department: 'Neurology', specialization: 'Neurology', bio: 'Neurologist handling outpatient consults, headache care, and referral coordination.' },
];

export const mockRecords: ClinicalRecord[] = [
  { id: 1, patient_id: 1, author_id: 2, encounter_type: 'Outpatient', diagnosis: 'Hypertension', treatment_plan: 'Low-sodium diet, exercise, medication review', prescriptions: 'Amlodipine 5mg daily', decrypted_clinical_notes: 'Patient improving, continue monitoring BP weekly.', document_url: null, created_at: '2026-04-02T07:30:00Z' },
  { id: 2, patient_id: 2, author_id: 2, encounter_type: 'Follow-up', diagnosis: 'Type 2 Diabetes', treatment_plan: 'Nutrition counseling, glucose monitoring', prescriptions: 'Metformin 500mg twice daily', decrypted_clinical_notes: 'Watch HbA1c trend and foot care.', document_url: null, created_at: '2026-04-02T07:45:00Z' },
];

export const mockInvoices: Invoice[] = [
  { id: 1, invoice_number: 'INV-3001', patient_id: 1, subtotal: 180, tax: 18, total: 198, balance_due: 78, status: 'Partially Paid', insurance_provider: 'Blue Horizon', notes: 'Consultation and medication' },
  { id: 2, invoice_number: 'INV-3002', patient_id: 2, subtotal: 240, tax: 24, total: 264, balance_due: 0, status: 'Paid', insurance_provider: 'MetroCare', notes: 'Lab panel' },
];

export const mockPayments: Payment[] = [
  { id: 1, invoice_id: 1, amount: 120, method: 'Card', transaction_reference: 'TXN-9001', received_by_id: 5, paid_at: '2026-04-02T08:00:00Z' },
  { id: 2, invoice_id: 2, amount: 264, method: 'Cash', transaction_reference: 'TXN-9002', received_by_id: 5, paid_at: '2026-04-01T15:15:00Z' },
];

export const mockInventory: InventoryItem[] = [
  { id: 1, sku: 'DRUG-ATENO-10', name: 'Atenolol 50mg', category: 'Medication', quantity_on_hand: 128, reorder_level: 50, unit_cost: 0.42, location: 'Pharmacy A', supplier: 'Global Meds', expiry_date: '2027-04-01' },
  { id: 2, sku: 'SUPP-GLOVES-M', name: 'Surgical Gloves M', category: 'Consumable', quantity_on_hand: 420, reorder_level: 150, unit_cost: 0.08, location: 'Supply Room', supplier: 'SterileCare', expiry_date: '2028-01-01' },
];

export const mockLabOrders: LabOrder[] = [
  { id: 1, order_number: 'LAB-4001', patient_id: 1, requested_by_id: 2, test_name: 'Complete Blood Count', specimen: 'Blood', priority: 'Normal', status: 'Completed', result_summary: 'Within range', result_value: 'Hb 13.2 / WBC 6.1', reference_range: 'Normal', result_file_url: null, completed_at: '2026-04-01T14:00:00Z', created_at: '2026-04-01T08:00:00Z' },
  { id: 2, order_number: 'LAB-4002', patient_id: 2, requested_by_id: 2, test_name: 'HbA1c', specimen: 'Blood', priority: 'High', status: 'Processing', result_summary: null, result_value: null, reference_range: '< 6.5%', result_file_url: null, completed_at: null, created_at: '2026-04-02T08:00:00Z' },
];

export const mockOperationalSnapshots: OperationalSnapshot[] = [
  { id: 'ward-a', title: 'Ward A', description: '24 beds, 19 occupied, 7 pending tasks', status: 'Stable' },
  { id: 'ward-b', title: 'Ward B', description: '18 beds, 12 occupied, 4 pending tasks', status: 'Stable' },
  { id: 'ot', title: 'Surgery & OT', description: '2 scheduled procedures and 1 room in prep', status: 'Busy' },
  { id: 'ed', title: 'Emergency', description: '1 critical patient under escalation protocol', status: 'Critical' },
  { id: 'opd', title: 'OPD Queue', description: '2 active consults and 15 minute average wait', status: 'Flowing' },
  { id: 'ipd', title: 'IPD Admissions', description: '2 admissions awaiting discharge planning', status: 'Active' },
];

export const mockDashboard: DashboardPayload = {
  stats: { patients: 1284, staff: 196, appointments_today: 47, revenue_this_month: 68420, pending_lab_orders: 23, critical_alerts: 3 },
  recent_patients: mockPatients,
  recent_appointments: mockAppointments,
  alerts: [
    { id: 1, title: 'Critical lab result', message: 'LAB-4002 is ready for review.', priority: 'High', created_at: '2026-04-02T08:20:00Z' },
    { id: 2, title: 'Appointment reminder', message: 'Taylor Brooks is due in 2 hours.', priority: 'Normal', created_at: '2026-04-02T08:05:00Z' },
  ],
};