import { Box, Button, Card, CardContent, Chip, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import type { ClinicalRecord, Patient } from '../types';

type Props = {
  patients: Patient[];
  records: ClinicalRecord[];
  onCreate: (payload: Record<string, unknown>) => Promise<void>;
};

export function ClinicalPage({ patients, records, onCreate }: Props) {
  const [signature, setSignature] = useState('Dr. A. Kumar');
  const [dispatchMessage, setDispatchMessage] = useState('');
  const [form, setForm] = useState({
    patient_id: patients[0]?.id ?? 1,
    author_id: 2,
    encounter_type: 'Outpatient',
    diagnosis: '',
    treatment_plan: '',
    prescriptions: '',
    encrypted_clinical_notes: '',
    document_url: '',
  });

  const selectedPatient = patients.find((patient) => patient.id === form.patient_id);
  const selectedPatientHistory = records.filter((record) => record.patient_id === form.patient_id).slice(0, 3);

  const prescriptionTemplates = [
    { label: 'Fever protocol', value: 'Paracetamol 650mg SOS x 3 days\nHydration and rest' },
    { label: 'BP review', value: 'Amlodipine 5mg OD\nBP charting for 7 days' },
    { label: 'Diabetes follow-up', value: 'Metformin 500mg BD with meals\nFasting sugar check in 1 week' },
  ];

  const columns = useMemo<GridColDef[]>(() => [
    { field: 'created_at', headerName: 'Created', width: 180 },
    { field: 'patient_id', headerName: 'Patient ID', width: 110 },
    { field: 'encounter_type', headerName: 'Encounter', width: 140 },
    { field: 'diagnosis', headerName: 'Diagnosis', flex: 1 },
    { field: 'treatment_plan', headerName: 'Treatment Plan', flex: 1.3 },
    { field: 'prescriptions', headerName: 'Prescriptions', flex: 1 },
  ], []);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk' }}>Clinical Workspace</Typography>
        <Typography color="text.secondary">EHR notes, lab visibility, billing context, and clinical decision support hooks.</Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 640 }}>
            <CardContent sx={{ height: '100%' }}>
              <DataGrid rows={records} columns={columns} disableRowSelectionOnClick pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} sx={{ border: 0 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>New clinical record</Typography>
                <TextField select label="Patient" value={form.patient_id} onChange={(event) => setForm({ ...form, patient_id: Number(event.target.value) })}>
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>{patient.full_name} ({patient.mrn})</MenuItem>
                  ))}
                </TextField>
                <TextField label="Author ID" type="number" value={form.author_id} onChange={(event) => setForm({ ...form, author_id: Number(event.target.value) })} />
                <TextField label="Encounter type" value={form.encounter_type} onChange={(event) => setForm({ ...form, encounter_type: event.target.value })} />
                <TextField label="Diagnosis" value={form.diagnosis} onChange={(event) => setForm({ ...form, diagnosis: event.target.value })} multiline minRows={2} />
                <TextField label="Treatment plan" value={form.treatment_plan} onChange={(event) => setForm({ ...form, treatment_plan: event.target.value })} multiline minRows={2} />
                <TextField label="Prescriptions" value={form.prescriptions} onChange={(event) => setForm({ ...form, prescriptions: event.target.value })} multiline minRows={2} />
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {prescriptionTemplates.map((template) => (
                    <Chip key={template.label} label={template.label} clickable onClick={() => setForm((prev) => ({ ...prev, prescriptions: template.value }))} />
                  ))}
                </Stack>
                <TextField label="Clinical notes" value={form.encrypted_clinical_notes} onChange={(event) => setForm({ ...form, encrypted_clinical_notes: event.target.value })} multiline minRows={3} />
                <TextField label="Digital signature" value={signature} onChange={(event) => setSignature(event.target.value)} />
                <TextField label="Document URL" value={form.document_url} onChange={(event) => setForm({ ...form, document_url: event.target.value })} />
                <Button startIcon={<AddRoundedIcon />} variant="contained" onClick={() => onCreate({ ...form, encrypted_clinical_notes: `${form.encrypted_clinical_notes}\n\nSigned: ${signature}`, document_url: form.document_url || undefined })}>
                  Save record
                </Button>
                <Button variant="outlined" onClick={() => setDispatchMessage('Prescription queued to patient via SMS and email dispatch service.')}>Send prescription to patient</Button>
                {dispatchMessage ? <Typography variant="body2" color="text.secondary">{dispatchMessage}</Typography> : null}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1.5, fontFamily: 'Space Grotesk' }}>Patient snapshot</Typography>
              {selectedPatient ? (
                <Stack spacing={1}>
                  <Typography sx={{ fontWeight: 700 }}>{selectedPatient.full_name} ({selectedPatient.mrn})</Typography>
                  <Typography variant="body2" color="text.secondary">Allergies: {selectedPatient.allergies || 'No known allergies'}</Typography>
                  <Typography variant="body2" color="text.secondary">Blood group: {selectedPatient.blood_group || 'Not specified'}</Typography>
                  <Typography variant="body2" color="text.secondary">Insurance: {selectedPatient.insurance_provider || 'Self-pay'}</Typography>
                </Stack>
              ) : (
                <Typography color="text.secondary">Select a patient to view quick details.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1.5, fontFamily: 'Space Grotesk' }}>Recent clinical history</Typography>
              <Stack spacing={1.25}>
                {selectedPatientHistory.map((record) => (
                  <Box key={record.id} sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(15,118,110,0.06)' }}>
                    <Typography sx={{ fontWeight: 700 }}>{record.diagnosis}</Typography>
                    <Typography variant="body2" color="text.secondary">{record.treatment_plan}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(record.created_at).toLocaleString()}</Typography>
                  </Box>
                ))}
                {selectedPatientHistory.length === 0 ? <Typography color="text.secondary">No prior records for this patient.</Typography> : null}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {[
          ['Electronic Health Records', 'Create notes, diagnose, prescribe, and attach documents.'],
          ['Billing Visibility', 'See balances, coverage, and collection state next to the encounter.'],
          ['Lab Integration', 'Track sample collection, processing, and final result release.'],
          ['Telemedicine', 'Switch a visit into a secure virtual consult flow.'],
        ].map(([title, description]) => (
          <Grid item xs={12} md={6} key={title}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>{title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>{description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}