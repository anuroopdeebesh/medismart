import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { KpiCard } from '../components/KpiCard';
import type { DashboardPayload } from '../types';

type Props = {
  data: DashboardPayload;
  onRefresh: () => void;
};

export function DashboardPage({ data, onRefresh }: Props) {
  const departmentBreakdown = [
    { label: 'Emergency', value: 28 },
    { label: 'Cardiology', value: 22 },
    { label: 'General OPD', value: 35 },
    { label: 'Lab', value: 15 },
  ];

  const waitTimeTrend = [14, 12, 16, 11, 10, 13, 9];

  const exportReport = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Patients', String(data.stats.patients)],
      ['Staff', String(data.stats.staff)],
      ['Appointments Today', String(data.stats.appointments_today)],
      ['Revenue This Month', String(data.stats.revenue_this_month)],
      ['Pending Lab Orders', String(data.stats.pending_lab_orders)],
      ['Critical Alerts', String(data.stats.critical_alerts)],
      ['Predictive Insight', 'Peak hours are 10-12 AM Tuesdays; schedule additional staff'],
    ];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'medismart-admin-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk' }}>
            Clinical Operations Dashboard
          </Typography>
          <Typography color="text.secondary">Hospital-wide visibility across care load, staffing, labs, finance, and risk signals.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<RefreshRoundedIcon />} variant="outlined" onClick={onRefresh}>
            Refresh
          </Button>
          <Button variant="contained" onClick={exportReport}>
            Export report
          </Button>
        </Stack>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, minWidth: 110 }}>
              Status legend
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Stable" sx={{ bgcolor: 'rgba(11,138,131,0.12)', color: '#0b8a83' }} />
              <Chip label="Monitoring" sx={{ bgcolor: 'rgba(29,111,214,0.12)', color: '#1d6fd6' }} />
              <Chip label="Pending" sx={{ bgcolor: 'rgba(217,119,6,0.14)', color: '#b45309' }} />
              <Chip label="Critical" sx={{ bgcolor: 'rgba(225,29,72,0.14)', color: '#be123c' }} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} lg={4}><KpiCard label="Patients" value={data.stats.patients.toLocaleString()} caption="Registered patient profiles" accent="#0b8a83" /></Grid>
        <Grid item xs={12} sm={6} lg={4}><KpiCard label="Staff" value={data.stats.staff.toLocaleString()} caption="Active workforce coverage" accent="#0f4c81" /></Grid>
        <Grid item xs={12} sm={6} lg={4}><KpiCard label="Appointments Today" value={data.stats.appointments_today} caption="Live scheduling throughput" accent="#1d6fd6" /></Grid>
        <Grid item xs={12} sm={6} lg={4}><KpiCard label="Revenue This Month" value={`$${data.stats.revenue_this_month.toLocaleString()}`} caption="Collected and posted revenue" accent="#0ea5a0" /></Grid>
        <Grid item xs={12} sm={6} lg={4}><KpiCard label="Pending Lab Orders" value={data.stats.pending_lab_orders} caption="Awaiting lab processing" accent="#2563eb" /></Grid>
        <Grid item xs={12} sm={6} lg={4}><KpiCard label="Critical Alerts" value={data.stats.critical_alerts} caption="Escalation queue" accent="#e11d48" /></Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk', mb: 2 }}>Care Queue</Typography>
              <Stack spacing={1.5}>
                {data.recent_appointments.map((appointment) => (
                  <Box key={appointment.id} sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(180deg, rgba(15,118,110,0.06), rgba(255,255,255,0.92))', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                      <Typography fontWeight={800}>{appointment.reason}</Typography>
                      <Typography variant="body2" color="text.secondary">Patient #{appointment.patient_id} · {appointment.department} · {appointment.location}</Typography>
                    </Box>
                    <Typography fontWeight={800} color="primary.main">{appointment.status}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk', mb: 2 }}>Clinical Alerts</Typography>
              <Stack spacing={1.5}>
                {data.alerts.map((alert) => (
                  <Box key={alert.id} sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(180deg, rgba(217,119,6,0.08), rgba(255,255,255,0.92))' }}>
                    <Typography fontWeight={800}>{alert.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{alert.message}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Space Grotesk' }}>Department load breakdown</Typography>
              <Stack spacing={1.2}>
                {departmentBreakdown.map((item) => (
                  <Box key={item.label}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">{item.label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.value}%</Typography>
                    </Stack>
                    <Box sx={{ height: 8, borderRadius: 6, backgroundColor: 'rgba(15,23,42,0.08)', overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${item.value}%`, background: 'linear-gradient(90deg, #0b8a83, #1d6fd6)' }} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Space Grotesk' }}>Average wait-time trend (min)</Typography>
              <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ minHeight: 130 }}>
                {waitTimeTrend.map((value, index) => (
                  <Box key={`${value}-${index}`} sx={{ flex: 1, borderRadius: 2, background: 'linear-gradient(180deg, rgba(29,111,214,0.7), rgba(11,138,131,0.75))', height: `${value * 7}px`, minHeight: 24 }} />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                Predictive insight: Peak hours are 10:00-12:00 on Tuesdays. Allocate additional triage and nursing staff during this window.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}