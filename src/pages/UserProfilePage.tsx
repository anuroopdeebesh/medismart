import { Box, Card, CardContent, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { useState } from 'react';

type Props = {
  fullName: string;
  email: string;
};

export function UserProfilePage({ fullName, email }: Props) {
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk' }}>My Profile</Typography>
        <Typography color="text.secondary">Personal details and communication preferences.</Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">Name</Typography>
            <Typography sx={{ fontWeight: 700 }}>{fullName}</Typography>
            <Typography variant="overline" color="text.secondary" sx={{ mt: 1 }}>Email</Typography>
            <Typography sx={{ fontWeight: 700 }}>{email}</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk', mb: 1 }}>Notifications</Typography>
          <FormControlLabel control={<Switch checked={smsAlerts} onChange={(event) => setSmsAlerts(event.target.checked)} />} label="SMS appointment reminders" />
          <FormControlLabel control={<Switch checked={emailAlerts} onChange={(event) => setEmailAlerts(event.target.checked)} />} label="Email updates and lab availability" />
        </CardContent>
      </Card>
    </Stack>
  );
}