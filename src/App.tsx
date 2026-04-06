import { CssBaseline, ThemeProvider, Typography, Box, Stack, Snackbar, Alert } from '@mui/material';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Shell } from './components/Shell';
import { medismartTheme } from './theme';
import { clearLoginContext, clearToken, createAppointment, createClinicalRecord, createInvoice, createInventoryItem, createPayment, createPatient, getAppointments, getClinicalRecords, getDashboard, getDoctors, getInvoices, getInventory, getLabOrders, getOperationalSnapshots, getPatients, getPayments, getUserProfile, login, saveLoginContext, saveToken } from './api/client';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { ClinicalPage } from './pages/ClinicalPage';
import { BillingPage } from './pages/BillingPage';
import { OperationsPage } from './pages/OperationsPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { UserProfilePage } from './pages/UserProfilePage';
import type { Appointment, ClinicalRecord, DashboardPayload, DoctorOption, Invoice, InventoryItem, LabOrder, OperationalSnapshot, Patient, Payment, Role, UserProfile } from './types';
import { mockDashboard, mockInvoices, mockInventory, mockLabOrders, mockOperationalSnapshots, mockPatients, mockAppointments, mockPayments, mockRecords } from './data/mock';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(Boolean(localStorage.getItem('medismart_token')));
  const [user, setUser] = useState<UserProfile>({ id: 1, full_name: 'MediSmart Admin', email: 'admin@medismart.local', role: 'Admin', phone: null });
  const [dashboard, setDashboard] = useState<DashboardPayload>(mockDashboard);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [records, setRecords] = useState<ClinicalRecord[]>(mockRecords);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(mockLabOrders);
  const [operations, setOperations] = useState<OperationalSnapshot[]>(mockOperationalSnapshots);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const isAdmin = user.role === 'Admin';

  const refreshWorkspace = async () => {
    const profile = await getUserProfile();
    setUser(profile);

    const [appointmentResponse, doctorResponse] = await Promise.all([getAppointments(), getDoctors()]);
    setAppointments(appointmentResponse.items);
    setDoctors(doctorResponse);

    if (profile.role === 'Admin') {
      const [dash, patientResponse, recordResponse, invoiceResponse, paymentResponse, inventoryResponse, labOrderResponse, operationalResponse] = await Promise.all([
        getDashboard(),
        getPatients(),
        getClinicalRecords(),
        getInvoices(),
        getPayments(),
        getInventory(),
        getLabOrders(),
        getOperationalSnapshots(),
      ]);
      setDashboard(dash);
      setPatients(patientResponse.items);
      setRecords(recordResponse);
      setInvoices(invoiceResponse);
      setPayments(paymentResponse);
      setInventory(inventoryResponse);
      setLabOrders(labOrderResponse);
      setOperations(operationalResponse);
    } else {
      const patientRecords = await getClinicalRecords();
      setPatients([]);
      setRecords(patientRecords);
      setInvoices([]);
      setPayments([]);
      setInventory([]);
      setLabOrders([]);
      setOperations([]);
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    void (async () => {
      try {
        await refreshWorkspace();
      } catch {
        setToast('Loaded demo data because the backend was not reachable.');
      }
    })();
  }, [authenticated]);

  const handleLogin = async (email: string, password: string, mode: 'admin' | 'user') => {
    saveLoginContext(mode, email);
    const token = await login(email, password);
    saveToken(token.access_token);
    try {
      const profile = await getUserProfile();
      if (mode === 'admin' && profile.role !== 'Admin') {
        clearLoginContext();
        clearToken();
        throw new Error('This account does not have admin access.');
      }
      if (mode === 'user' && profile.role === 'Admin') {
        clearLoginContext();
        clearToken();
        throw new Error('Please use a patient/user account for User login.');
      }
      setUser(profile);
      setAuthenticated(true);
      setToast('Signed in successfully.');
      navigate('/');
    } catch (error) {
      clearLoginContext();
      clearToken();
      throw error;
    }
  };

  const handleLogout = () => {
    clearLoginContext();
    clearToken();
    setAuthenticated(false);
    setToast('Signed out.');
    navigate('/login');
  };

  return (
    <ThemeProvider theme={medismartTheme}>
      <CssBaseline />
      {!authenticated && location.pathname !== '/login' ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="*"
            element={
              <Shell userName={user.full_name} userRole={user.role} onLogout={handleLogout}>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Secure hospital operating environment</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{user.email}</Typography>
                  </Box>
                  <Routes>
                    <Route path="/" element={isAdmin ? <DashboardPage data={dashboard} onRefresh={async () => setDashboard(await getDashboard())} /> : <UserDashboardPage userName={user.full_name} appointments={appointments} records={records} />} />
                    <Route
                      path="/patients"
                      element={
                        isAdmin ? (
                          <PatientsPage
                            rows={patients}
                            onCreate={async (patient) => {
                              const created = await createPatient(patient);
                              setPatients((prev) => [created, ...prev]);
                              setToast('Patient created.');
                            }}
                          />
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />
                    <Route
                      path="/schedule"
                      element={
                        <AppointmentsPage
                          rows={appointments}
                          doctors={doctors}
                          patients={isAdmin ? patients : [{ id: appointments[0]?.patient_id ?? 1, full_name: user.full_name, mrn: 'SELF' }]}
                          mode={isAdmin ? 'admin' : 'user'}
                          onCreate={async (payload) => {
                            const created = await createAppointment(payload);
                            setAppointments((prev) => [created, ...prev]);
                            setToast(isAdmin ? 'Appointment booked.' : 'Appointment request submitted.');
                          }}
                        />
                      }
                    />
                    <Route
                      path="/clinical"
                      element={
                        isAdmin ? (
                          <ClinicalPage
                            patients={patients}
                            records={records}
                            onCreate={async (payload) => {
                              const created = await createClinicalRecord(payload);
                              setRecords((prev) => [created, ...prev]);
                              setToast('Clinical record saved.');
                            }}
                          />
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />
                    <Route
                      path="/billing"
                      element={
                        isAdmin ? (
                          <BillingPage
                            patients={patients}
                            invoices={invoices}
                            payments={payments}
                            onCreateInvoice={async (payload) => {
                              const created = await createInvoice(payload);
                              setInvoices((prev) => [created, ...prev]);
                              setToast('Invoice created.');
                            }}
                            onCreatePayment={async (payload) => {
                              const created = await createPayment(payload);
                              setPayments((prev) => [created, ...prev]);
                              setToast('Payment recorded.');
                            }}
                          />
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />
                    <Route
                      path="/operations"
                      element={
                        isAdmin ? (
                          <OperationsPage
                            inventory={inventory}
                            labOrders={labOrders}
                            snapshots={operations}
                            onCreateInventory={async (payload) => {
                              const created = await createInventoryItem(payload);
                              setInventory((prev) => [created, ...prev]);
                              setToast('Inventory item added.');
                            }}
                          />
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />
                    <Route path="/profile" element={isAdmin ? <Navigate to="/" replace /> : <UserProfilePage fullName={user.full_name} email={user.email} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Stack>
                <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                  <Alert severity="info" variant="filled" onClose={() => setToast(null)} sx={{ width: '100%' }}>{toast}</Alert>
                </Snackbar>
              </Shell>
            }
          />
        </Routes>
      )}
    </ThemeProvider>
  );
}