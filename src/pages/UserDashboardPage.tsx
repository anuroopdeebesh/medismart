import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import type { Appointment, ClinicalRecord } from '../types';

type Props = {
  userName: string;
  appointments: Appointment[];
  records: ClinicalRecord[];
};

export function UserDashboardPage({ userName, appointments, records }: Props) {
  const upcoming = appointments
    .filter((item) => new Date(item.start_time) > new Date())
    .sort((left, right) => new Date(left.start_time).getTime() - new Date(right.start_time).getTime());
  const completed = appointments.filter((item) => item.status === 'Completed');
  const nextVisit = upcoming[0];
  const recentRecords = records.slice(0, 4);
  const recentPrescription = recentRecords
    .map((record) => record.prescriptions)
    .find((prescription) => Boolean(prescription?.trim()));

  const careNotes = [
    nextVisit ? `Next visit with ${nextVisit.department} on ${new Date(nextVisit.start_time).toLocaleDateString()}.` : 'No visit is currently scheduled.',
    'Bring your ID, insurance card, and any recent lab reports to the hospital.',
    'Use the appointment page to request a new slot or review your existing bookings.',
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk' }}>Welcome, {userName}</Typography>
        <Typography color="text.secondary">Track your appointments, stay informed, and manage your hospital interactions in one place.</Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Upcoming Appointments</Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk' }}>{upcoming.length}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>The nearest appointment is shown first for quick access.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Completed Visits</Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk' }}>{completed.length}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Completed encounters stay available for history and follow-up.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Quick Guidance</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>Use "My Appointments" to request or review your bookings.</Typography>
              <Chip label={nextVisit ? 'Visit planned' : 'No active booking'} color={nextVisit ? 'success' : 'default'} size="small" sx={{ mt: 1.5 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Space Grotesk' }}>Care summary</Typography>
              <Stack spacing={1.25}>
                {careNotes.map((note) => (
                  <Box key={note} sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(15,118,110,0.07)' }}>
                    <Typography variant="body2">{note}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Space Grotesk' }}>Next appointment</Typography>
              {nextVisit ? (
                <Stack spacing={1}>
                  <Typography sx={{ fontWeight: 800 }}>{nextVisit.department}</Typography>
                  <Typography variant="body2" color="text.secondary">{nextVisit.reason}</Typography>
                  <Typography variant="body2" color="text.secondary">{new Date(nextVisit.start_time).toLocaleString()} · {nextVisit.location ?? 'Hospital'}</Typography>
                  <Chip label={nextVisit.status} color="primary" size="small" sx={{ width: 'fit-content' }} />
                </Stack>
              ) : (
                <Typography color="text.secondary">There is no active appointment yet. Use scheduling to request one.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Space Grotesk' }}>Upcoming schedule</Typography>
          <Stack
            direction={{ xs: 'row', md: 'column' }}
            spacing={1.25}
            sx={{
              overflowX: { xs: 'auto', md: 'visible' },
              scrollSnapType: { xs: 'x mandatory', md: 'none' },
              pb: { xs: 0.5, md: 0 },
            }}
          >
            {upcoming.slice(0, 5).map((item) => (
              <Box key={item.id} sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(15,118,110,0.07)', minWidth: { xs: 280, md: 'auto' }, scrollSnapAlign: { xs: 'start', md: 'none' } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{item.department} · {item.reason}</Typography>
                    <Typography variant="body2" color="text.secondary">{new Date(item.start_time).toLocaleString()} · {item.location ?? 'Hospital'}</Typography>
                  </Box>
                  <Chip label={item.status} size="small" variant="outlined" />
                </Stack>
              </Box>
            ))}
            {upcoming.length === 0 ? <Typography color="text.secondary">No upcoming appointments right now.</Typography> : null}
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Space Grotesk' }}>Recent test results & visits</Typography>
              <Stack spacing={1.25}>
                {recentRecords.map((record) => (
                  <Box key={record.id} sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(29,111,214,0.07)' }}>
                    <Typography sx={{ fontWeight: 700 }}>{record.encounter_type} · {record.diagnosis}</Typography>
                    <Typography variant="body2" color="text.secondary">{new Date(record.created_at).toLocaleString()}</Typography>
                  </Box>
                ))}
                {recentRecords.length === 0 ? <Typography color="text.secondary">No recent records available.</Typography> : null}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Space Grotesk' }}>Prescriptions & reminders</Typography>
              <Stack spacing={1.25}>
                <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(15,118,110,0.07)' }}>
                  <Typography sx={{ fontWeight: 700 }}>Latest prescription</Typography>
                  <Typography variant="body2" color="text.secondary">{recentPrescription || 'No prescription has been recorded yet.'}</Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(217,119,6,0.09)' }}>
                  <Typography sx={{ fontWeight: 700 }}>Reminders enabled</Typography>
                  <Typography variant="body2" color="text.secondary">SMS and email appointment reminders are managed in My Profile notifications.</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}