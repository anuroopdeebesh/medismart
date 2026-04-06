import { Box, Button, Card, CardContent, Chip, Stack, TextField, Typography } from '@mui/material';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  onLogin: (email: string, password: string, mode: 'admin' | 'user') => Promise<void>;
};

export function LoginPage({ onLogin }: Props) {
  const [mode, setMode] = useState<'admin' | 'user'>('admin');
  const [email, setEmail] = useState('admin@medismart.local');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const displayName = useMemo(() => {
    const local = (email.split('@')[0] || '').trim();
    if (!local) return mode === 'admin' ? 'Admin User' : 'Patient User';
    return local
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }, [email, mode]);

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 4 }, p: { xs: 2, md: 4 } }}>
      <Box sx={{ p: { xs: 2, md: 5 }, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d8dee9', borderRadius: 5, background: 'linear-gradient(160deg, #ffffff 0%, #f8fbff 70%)' }}>
        <Stack spacing={3} sx={{ maxWidth: 620 }}>
          <Chip icon={<LocalHospitalRoundedIcon />} label="MediSmart" color="primary" sx={{ width: 'fit-content', px: 1.25, py: 2.25, fontWeight: 700 }} />
          <Typography variant="h1" sx={{ fontSize: { xs: 38, md: 56 }, lineHeight: 1 }}>
            MediSmart
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500, maxWidth: 520, fontSize: { xs: 18, md: 20 } }}>
            Smart hospital management for appointments, patient care, billing, and daily operations.
          </Typography>

          <Card sx={{ border: '1px solid #d8dee9', backgroundColor: '#ffffff' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(145deg, #0f766e, #0ea5a0)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
                  {initials || 'U'}
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Real-time profile preview</Typography>
                  <Typography sx={{ fontWeight: 800 }}>{displayName}</Typography>
                  <Typography variant="body2" color="text.secondary">{mode === 'admin' ? 'Administrator Access' : 'Patient/User Access'}</Typography>
                </Box>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                Session time: {clock.toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Box sx={{ p: { xs: 2, md: 5 }, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d8dee9', borderRadius: 5, background: 'linear-gradient(160deg, #ffffff 0%, #f9fafb 70%)' }}>
        <Card sx={{ width: '100%', maxWidth: 500, border: '1px solid #d8dee9', background: '#ffffff', boxShadow: '0 18px 38px rgba(15,23,42,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={1.25}>
                <Button
                  variant={mode === 'admin' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setMode('admin');
                    setEmail('admin@medismart.local');
                    setPassword('Admin@123');
                  }}
                >
                  Admin Login
                </Button>
                <Button
                  variant={mode === 'user' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setMode('user');
                    setEmail('');
                    setPassword('Patient@123');
                  }}
                >
                  User Login
                </Button>
              </Stack>

              <Box>
                <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk' }}>
                  {mode === 'admin' ? 'Admin sign in' : 'User sign in'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mode === 'admin'
                    ? 'Access system controls, clinical operations, and billing management.'
                    : 'Access your appointments, care updates, and personal profile.'}
                </Typography>
              </Box>
              <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
              <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} fullWidth />
              {error ? <Typography color="error.main" variant="body2">{error}</Typography> : null}
              <Button
                size="large"
                variant="contained"
                onClick={async () => {
                  setLoading(true);
                  setError('');
                  try {
                    await onLogin(email, password, mode);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Unable to sign in');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Enter MediSmart'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}