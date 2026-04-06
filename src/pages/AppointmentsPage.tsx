import { Alert, Avatar, Box, Button, Card, CardContent, Chip, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import type { Appointment, DoctorOption } from '../types';

type Props = {
  rows: Appointment[];
  patients: Array<{ id: number; full_name: string; mrn: string }>;
  doctors: DoctorOption[];
  mode?: 'admin' | 'user';
  onCreate: (payload: Record<string, unknown>) => Promise<void>;
};

export function AppointmentsPage({ rows, patients, doctors, mode = 'admin', onCreate }: Props) {
  const now = new Date();
  const todayISO = now.toISOString().slice(0, 10);
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(doctors[0]?.id ?? 2);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    patient_id: patients[0]?.id ?? 1,
    doctor_id: doctors[0]?.id ?? 2,
    department: 'Cardiology',
    reason: '',
    start_time: '2026-04-02T10:00',
    end_time: '2026-04-02T10:30',
    slot_code: 'NEW-001',
    location: 'Clinic 3',
  });

  const columns = useMemo<GridColDef[]>(() => [
    { field: 'slot_code', headerName: 'Slot', width: 110 },
    { field: 'patient_id', headerName: 'Patient', width: 100 },
    { field: 'department', headerName: 'Department', flex: 1 },
    { field: 'reason', headerName: 'Reason', flex: 1.3 },
    { field: 'status', headerName: 'Status', width: 140 },
    { field: 'location', headerName: 'Location', flex: 1 },
  ], []);

  const specialties = ['All', ...Array.from(new Set(doctors.map((doctor) => doctor.department ?? doctor.specialization ?? 'General')))].filter(Boolean);

  const filteredDoctors = useMemo(() => {
    if (specialtyFilter === 'All') return doctors;
    return doctors.filter((doctor) => (doctor.department ?? doctor.specialization ?? 'General') === specialtyFilter);
  }, [doctors, specialtyFilter]);

  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) ?? doctors[0];

  const dateOptions = useMemo(() => {
    return Array.from({ length: 7 }, (_, dayOffset) => {
      const date = new Date(now);
      date.setDate(now.getDate() + dayOffset);
      const value = date.toISOString().slice(0, 10);
      return {
        value,
        label: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      };
    });
  }, [now]);

  const slotOptions = useMemo(() => {
    const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'];
    const bookedKeys = new Set(
      rows
        .filter((appointment) => appointment.doctor_id === selectedDoctorId)
        .map((appointment) => new Date(appointment.start_time).toISOString().slice(0, 16)),
    );
    return slots.map((slot) => {
      const [hours, minutes] = slot.split(':').map(Number);
      const start = new Date(`${selectedDate}T00:00:00`);
      start.setHours(hours, minutes, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 30);
      const isoKey = start.toISOString().slice(0, 16);
      const isBooked = bookedKeys.has(isoKey);
      return {
        label: slot,
        start: start.toISOString(),
        end: end.toISOString(),
        active: !isBooked,
      };
    });
  }, [rows, selectedDate, selectedDoctorId]);

  const selectSlot = (slot: { label: string; start: string; end: string; active: boolean }) => {
    if (!slot.active) return;
    setSelectedSlot(slot.label);
    setForm((prev) => ({ ...prev, start_time: slot.start.slice(0, 16), end_time: slot.end.slice(0, 16) }));
  };

  const handleBook = async () => {
    await onCreate({
      ...form,
      patient_id: mode === 'admin' ? form.patient_id : patients[0]?.id ?? 1,
      doctor_id: form.doctor_id,
      status: 'Scheduled',
      slot_code: mode === 'admin' ? form.slot_code : undefined,
      start_time: new Date(form.start_time).toISOString(),
      end_time: new Date(form.end_time).toISOString(),
    });
    setBookingMessage(`Confirmed ${selectedDate} ${selectedSlot || new Date(form.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} with ${selectedDoctor?.full_name ?? 'selected doctor'}.`);
  };

  const handleQuickBook = async (slot: { label: string; start: string; end: string; active: boolean }) => {
    if (!slot.active || mode !== 'user') return;
    setSelectedSlot(slot.label);
    setForm((prev) => ({ ...prev, start_time: slot.start.slice(0, 16), end_time: slot.end.slice(0, 16) }));
    await onCreate({
      ...form,
      patient_id: patients[0]?.id ?? 1,
      doctor_id: form.doctor_id,
      status: 'Scheduled',
      slot_code: undefined,
      reason: form.reason || 'General consultation',
      start_time: slot.start,
      end_time: slot.end,
    });
    setBookingMessage(`One-click booking confirmed for ${slot.label} on ${selectedDate}.`);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk' }}>{mode === 'admin' ? 'Scheduling Console' : 'My Appointments'}</Typography>
        <Typography color="text.secondary">{mode === 'admin' ? 'Manage bookings, calendar flow, and live appointment status updates.' : 'Review your visits and request new appointment slots.'}</Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>Filter by specialty</Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {specialties.map((specialty) => (
                <Chip
                  key={specialty}
                  label={specialty}
                  clickable
                  color={specialtyFilter === specialty ? 'primary' : 'default'}
                  onClick={() => setSpecialtyFilter(specialty)}
                  sx={{ height: 38 }}
                />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} xl={8}>
          <Card sx={{ height: 640 }}>
            <CardContent sx={{ height: '100%' }}>
              <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} sx={{ border: 0 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} xl={4}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>{mode === 'admin' ? 'New booking' : 'Request appointment'}</Typography>
                {selectedDoctor ? (
                  <Card variant="outlined" sx={{ backgroundColor: 'rgba(11,138,131,0.04)' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: '#0b8a83', color: '#fff' }}>{selectedDoctor.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 800 }}>{selectedDoctor.full_name}</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedDoctor.department ?? selectedDoctor.specialization ?? 'General Medicine'}</Typography>
                          <Typography variant="caption" color="text.secondary">{selectedDoctor.bio ?? 'Available for outpatient consultation and follow-up.'}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ) : null}
                {mode === 'admin' ? (
                  <TextField select label="Patient" value={form.patient_id} onChange={(event) => setForm({ ...form, patient_id: Number(event.target.value) })}>
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>{patient.full_name} ({patient.mrn})</MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField label="Patient" value={patients[0]?.full_name ?? 'Current user'} disabled />
                )}
                <TextField select label="Doctor" value={form.doctor_id} onChange={(event) => {
                  const doctorId = Number(event.target.value);
                  const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);
                  setSelectedDoctorId(doctorId);
                  setForm({
                    ...form,
                    doctor_id: doctorId,
                    department: selectedDoctor?.department ?? form.department,
                  });
                }}>
                  {filteredDoctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {doctor.full_name}{doctor.department ? ` (${doctor.department})` : ''}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField label="Department" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} />
                <TextField label="Reason" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} />
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>Availability calendar</Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {dateOptions.map((date) => (
                      <Chip
                        key={date.value}
                        label={date.label}
                        clickable
                        color={selectedDate === date.value ? 'primary' : 'default'}
                        onClick={() => setSelectedDate(date.value)}
                        sx={{ height: 38 }}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>Available time slots</Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {slotOptions.map((slot) => (
                      <Chip
                        key={slot.label}
                        label={slot.active ? slot.label : `${slot.label} · Booked`}
                        clickable={slot.active}
                        color={selectedSlot === slot.label ? 'primary' : slot.active ? 'default' : 'error'}
                        onClick={() => {
                          if (mode === 'user') {
                            void handleQuickBook(slot);
                          } else {
                            selectSlot(slot);
                          }
                        }}
                        sx={{ height: 38 }}
                      />
                    ))}
                  </Stack>
                </Box>
                <TextField label="Start time" type="datetime-local" value={form.start_time} onChange={(event) => setForm({ ...form, start_time: event.target.value })} />
                <TextField label="End time" type="datetime-local" value={form.end_time} onChange={(event) => setForm({ ...form, end_time: event.target.value })} />
                {mode === 'admin' ? <TextField label="Slot code" value={form.slot_code} onChange={(event) => setForm({ ...form, slot_code: event.target.value })} /> : null}
                <TextField label="Location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
                <Button startIcon={<ScheduleRoundedIcon />} variant="contained" onClick={() => void handleBook()}>
                  {mode === 'admin' ? 'Book appointment' : 'Request slot'}
                </Button>
                {selectedSlot ? <Typography variant="caption" color="text.secondary">Selected slot: {selectedSlot}</Typography> : null}
                {bookingMessage ? <Alert severity="success" onClose={() => setBookingMessage(null)}>{bookingMessage}</Alert> : null}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {filteredDoctors.map((doctor) => (
          <Grid item xs={12} md={6} key={doctor.id}>
            <Card
              onClick={() => {
                setSelectedDoctorId(doctor.id);
                setForm((prev) => ({ ...prev, doctor_id: doctor.id, department: doctor.department ?? prev.department }));
              }}
              sx={{ cursor: 'pointer', borderColor: selectedDoctorId === doctor.id ? '#0b8a83' : undefined }}
            >
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: '#0b8a83', color: '#fff' }}>{doctor.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 800 }}>{doctor.full_name}</Typography>
                    <Typography variant="body2" color="text.secondary">{doctor.department ?? doctor.specialization ?? 'General Medicine'}</Typography>
                    <Typography variant="caption" color="text.secondary">{doctor.bio ?? 'Focused on outpatient consultation and follow-up care.'}</Typography>
                  </Box>
                  <Button size="small" variant={selectedDoctorId === doctor.id ? 'contained' : 'outlined'}>
                    {selectedDoctorId === doctor.id ? 'Selected' : 'Select'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}