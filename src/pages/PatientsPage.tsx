import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useMemo, useState } from 'react';
import type { Patient } from '../types';

type Props = {
  rows: Patient[];
  onCreate: (patient: Partial<Patient>) => Promise<void>;
};

export function PatientsPage({ rows, onCreate }: Props) {
  const [form, setForm] = useState<Partial<Patient>>({ full_name: '', mrn: '', gender: 'Female', portal_access: true });

  const columns = useMemo<GridColDef[]>(() => [
    { field: 'mrn', headerName: 'MRN', flex: 1 },
    { field: 'full_name', headerName: 'Patient', flex: 1.2 },
    { field: 'gender', headerName: 'Gender', width: 120 },
    { field: 'blood_group', headerName: 'Blood Group', width: 130 },
    { field: 'insurance_provider', headerName: 'Insurance', flex: 1 },
    { field: 'portal_access', headerName: 'Portal', width: 100, valueFormatter: (value) => (value ? 'Yes' : 'No') },
  ], []);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk' }}>Patient Management</Typography>
        <Typography color="text.secondary">Register patients, track profiles, and prepare compliance exports from one workspace.</Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} xl={8}>
          <Card sx={{ height: 640 }}>
            <CardContent sx={{ height: '100%' }}>
              <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { background: 'rgba(15,118,110,0.04)' } }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} xl={4}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>New patient</Typography>
                <TextField label="Full name" value={form.full_name ?? ''} onChange={(event) => setForm({ ...form, full_name: event.target.value })} />
                <TextField label="MRN" value={form.mrn ?? ''} onChange={(event) => setForm({ ...form, mrn: event.target.value })} />
                <TextField label="Gender" value={form.gender ?? ''} onChange={(event) => setForm({ ...form, gender: event.target.value })} />
                <TextField label="Phone" value={form.phone ?? ''} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                <TextField label="Email" value={form.email ?? ''} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                <Button startIcon={<AddRoundedIcon />} variant="contained" onClick={() => onCreate(form)}>
                  Register patient
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}