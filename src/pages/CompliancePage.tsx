import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { useState } from 'react';
import { getComplianceExport } from '../api/client';

export function CompliancePage() {
  const [patientId, setPatientId] = useState('1');
  const [result, setResult] = useState('');

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk' }}>Security & Compliance</Typography>
        <Typography color="text.secondary">RBAC, audit readiness, HIPAA/GDPR-style data export, and deletion pathways.</Typography>
      </Box>

      <Grid container spacing={2.5}>
        {[
          ['Role-based access control', 'Admin, Doctor, Nurse, Receptionist, Pharmacist, Lab Technician, Radiologist, Accountant, Patient, Vendor.'],
          ['Encryption', 'Sensitive notes are encrypted before storage.'],
          ['Audit logs', 'Every create, read, update, delete, login, and export action is recorded.'],
          ['Data rights', 'Support export, deletion, and consent-aware workflows.'],
        ].map(([title, description]) => (
          <Grid item xs={12} md={6} key={title}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <SecurityRoundedIcon color="primary" />
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>{title}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>{description}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }}>
            <TextField label="Patient ID" value={patientId} onChange={(event) => setPatientId(event.target.value)} sx={{ width: 200 }} />
            <Button startIcon={<DownloadRoundedIcon />} variant="contained" onClick={async () => setResult(JSON.stringify(await getComplianceExport(Number(patientId)), null, 2))}>
              Export data
            </Button>
            <Button startIcon={<DeleteForeverRoundedIcon />} variant="outlined" color="error">
              Delete request
            </Button>
          </Stack>
          {result ? <Box component="pre" sx={{ mt: 2, p: 2, borderRadius: 2, overflow: 'auto', background: 'rgba(15,23,42,0.96)', color: '#e2e8f0' }}>{result}</Box> : null}
        </CardContent>
      </Card>
    </Stack>
  );
}