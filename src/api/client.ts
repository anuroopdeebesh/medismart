import { demoToken, mockAppointments, mockDashboard, mockDoctors, mockInvoices, mockInventory, mockLabOrders, mockModules, mockOperationalSnapshots, mockPayments, mockPatients, mockRecords } from '../data/mock';
import type { Appointment, AuthToken, ClinicalRecord, DashboardPayload, DoctorOption, Invoice, InventoryItem, LabOrder, ModuleCard, OperationalSnapshot, Patient, Payment, Role, UserProfile } from '../types';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const frontendOnlyMode = (import.meta.env.VITE_FRONTEND_ONLY ?? 'true').toLowerCase() === 'true';

const loginModeKey = 'medismart_login_mode';
const loginEmailKey = 'medismart_login_email';

function getToken(): string | null {
  return localStorage.getItem('medismart_token');
}

export function saveToken(token: string) {
  localStorage.setItem('medismart_token', token);
}

export function clearToken() {
  localStorage.removeItem('medismart_token');
}

export function saveLoginContext(mode: 'admin' | 'user', email: string) {
  localStorage.setItem(loginModeKey, mode);
  localStorage.setItem(loginEmailKey, email);
}

export function clearLoginContext() {
  localStorage.removeItem(loginModeKey);
  localStorage.removeItem(loginEmailKey);
}

async function request<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  if (frontendOnlyMode) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Frontend-only mode: missing fallback for ${path}`);
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error('MediSmart API is unavailable');
  }
}

export async function login(email: string, password: string): Promise<AuthToken> {
  try {
    return await request<AuthToken>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  } catch {
    return { access_token: demoToken, token_type: 'bearer' };
  }
}

export async function getDashboard(): Promise<DashboardPayload> {
  return request<DashboardPayload>('/dashboard', undefined, mockDashboard);
}

export async function getModules(): Promise<ModuleCard[]> {
  return request<ModuleCard[]>('/modules', undefined, mockModules);
}

export async function getPatients(): Promise<{ items: Patient[]; pagination: { total: number } }> {
  return request('/patients?page=1&page_size=25', undefined, { items: mockPatients, pagination: { total: mockPatients.length } });
}

export async function createPatient(patient: Partial<Patient>): Promise<Patient> {
  return request<Patient>('/patients', { method: 'POST', body: JSON.stringify(patient) }, { ...mockPatients[0], ...patient, id: Date.now() });
}

export async function getAppointments(): Promise<{ items: Appointment[] }> {
  return request('/appointments?page=1&page_size=25', undefined, { items: mockAppointments });
}

export async function createAppointment(payload: Record<string, unknown>): Promise<Appointment> {
  return request<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(payload) }, { ...mockAppointments[0], id: Date.now() });
}

export async function getDoctors(): Promise<DoctorOption[]> {
  return request('/doctors', undefined, mockDoctors);
}

export async function getClinicalRecords(patientId?: number): Promise<ClinicalRecord[]> {
  const query = patientId ? `?patient_id=${patientId}` : '';
  return request(`/ehr/records${query}`, undefined, mockRecords);
}

export async function createClinicalRecord(payload: Record<string, unknown>): Promise<ClinicalRecord> {
  return request<ClinicalRecord>('/ehr/records', { method: 'POST', body: JSON.stringify(payload) }, { ...mockRecords[0], id: Date.now() });
}

export async function getInvoices(): Promise<Invoice[]> {
  return request('/billing/invoices', undefined, mockInvoices);
}

export async function createInvoice(payload: Record<string, unknown>): Promise<Invoice> {
  return request<Invoice>('/billing/invoices', { method: 'POST', body: JSON.stringify(payload) }, { ...mockInvoices[0], id: Date.now() });
}

export async function getPayments(): Promise<Payment[]> {
  return request('/billing/payments', undefined, mockPayments);
}

export async function createPayment(payload: Record<string, unknown>): Promise<Payment> {
  return request<Payment>('/billing/payments', { method: 'POST', body: JSON.stringify(payload) }, { ...mockPayments[0], id: Date.now() });
}

export async function getInventory(lowStock = false): Promise<InventoryItem[]> {
  return request(`/inventory/items${lowStock ? '?low_stock=true' : ''}`, undefined, mockInventory);
}

export async function createInventoryItem(payload: Record<string, unknown>): Promise<InventoryItem> {
  return request<InventoryItem>('/inventory/items', { method: 'POST', body: JSON.stringify(payload) }, { ...mockInventory[0], id: Date.now() });
}

export async function getLabOrders(): Promise<LabOrder[]> {
  return request('/lab/orders', undefined, mockLabOrders);
}

export async function createLabOrder(payload: Record<string, unknown>): Promise<LabOrder> {
  return request<LabOrder>('/lab/orders', { method: 'POST', body: JSON.stringify(payload) }, { ...mockLabOrders[0], id: Date.now() });
}

export async function getOperationalSnapshots(): Promise<OperationalSnapshot[]> {
  return mockOperationalSnapshots;
}

export async function getUserProfile(): Promise<UserProfile> {
  const mode = localStorage.getItem(loginModeKey) as 'admin' | 'user' | null;
  const email = localStorage.getItem(loginEmailKey) ?? 'demo@medismart.local';
  const fullName = email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Demo User';
  return request('/auth/me', undefined, {
    id: 1,
    full_name: fullName,
    email,
    role: mode === 'user' ? ('Patient' as Role) : ('Admin' as Role),
    phone: null,
  });
}

export async function getComplianceExport(patientId: number) {
  return request(`/compliance/export/${patientId}`, undefined, { patient: mockPatients[0], appointments: mockAppointments, records: [], invoices: [], lab_orders: [] });
}