import { AppBar, Avatar, BottomNavigation, BottomNavigationAction, Box, Breadcrumbs, Button, Drawer, IconButton, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, Stack, TextField, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 280;

const nav = [
  { to: '/', label: 'Dashboard', icon: <DashboardRoundedIcon /> },
  { to: '/patients', label: 'Patients', icon: <PeopleAltRoundedIcon /> },
  { to: '/schedule', label: 'Scheduling', icon: <CalendarMonthRoundedIcon /> },
  { to: '/clinical', label: 'Clinical', icon: <MedicalServicesRoundedIcon /> },
  { to: '/billing', label: 'Billing', icon: <ReceiptLongRoundedIcon /> },
  { to: '/operations', label: 'Operations', icon: <WarehouseRoundedIcon /> },
];

const userNav = [
  { to: '/', label: 'My Dashboard', icon: <DashboardRoundedIcon /> },
  { to: '/schedule', label: 'My Appointments', icon: <CalendarMonthRoundedIcon /> },
  { to: '/profile', label: 'My Profile', icon: <PersonRoundedIcon /> },
];

type Props = {
  userName: string;
  userRole: string;
  onLogout: () => void;
  children: ReactNode;
};

export function Shell({ userName, userRole, onLogout, children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = userRole === 'Patient' ? userNav : nav;

  const currentPath = location.pathname;
  const breadcrumbParts = currentPath
    .split('/')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  const breadcrumbLabel = useMemo(
    () => (breadcrumbParts.length ? `Home / ${breadcrumbParts.join(' / ')}` : 'Home / Dashboard'),
    [breadcrumbParts],
  );

  const drawerContent = (
    <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2.5, background: 'linear-gradient(145deg, #0f766e, #0ea5a0)', border: '1px solid #0f766e', display: 'grid', placeItems: 'center', color: '#ffffff', fontWeight: 800, fontFamily: 'Space Grotesk', boxShadow: '0 8px 20px rgba(15,118,110,0.25)' }}>
          M
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk', lineHeight: 1, color: '#0f172a' }}>
            MediSmart
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Hospital command center
          </Typography>
        </Box>
      </Stack>

      <Typography variant="overline" sx={{ color: '#64748b', letterSpacing: 1.3 }}>
        Clinical Navigation
      </Typography>
      <List sx={{ mt: 1, flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={Link}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={() => setMobileOpen(false)}
            sx={{
              mb: 0.75,
              borderRadius: 2.5,
              color: '#0f172a',
              border: '1px solid #d8dee9',
              background: 'linear-gradient(180deg, rgba(15,23,42,0.02), rgba(15,23,42,0))',
              transition: 'all 220ms ease',
              minHeight: 48,
              '&:hover': { transform: 'translateX(2px)', background: 'rgba(15, 118, 110, 0.08)' },
              '&.Mui-selected': { background: 'linear-gradient(135deg, rgba(15,118,110,0.16), rgba(37,99,235,0.12))', borderColor: '#a7f3d0' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: '#0f766e' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700, color: '#0f172a' }} />
          </ListItemButton>
        ))}
      </List>

      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1.5, mb: 1 }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: '#0f766e', color: '#ffffff', border: '1px solid #0f766e' }}>{userName.charAt(0)}</Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 700 }} noWrap>
            {userName}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }} noWrap>
            {userRole}
          </Typography>
        </Box>
      </Stack>

      <Button variant="outlined" onClick={onLogout} sx={{ mt: 2, borderColor: '#cbd5e1', color: '#0f172a', minHeight: 44 }}>
        Logout
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(90deg, #ffffff 0%, #f5f8fc 100%)', borderBottom: '1px solid #d8dee9' }}>
        <Toolbar sx={{ minHeight: 80, px: { xs: 2, md: 3 }, gap: 1.5 }}>
          {isMobile ? (
            <IconButton aria-label="Open navigation" onClick={() => setMobileOpen(true)} size="large">
              <MenuRoundedIcon />
            </IconButton>
          ) : null}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 0.4 }}>
              <Typography variant="caption" color="text.secondary">Home</Typography>
              <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 700 }}>{breadcrumbParts.length ? breadcrumbParts[breadcrumbParts.length - 1] : 'Dashboard'}</Typography>
            </Breadcrumbs>
            <Typography variant="body2" color="text.secondary" noWrap>{breadcrumbLabel}</Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Search patients or MRN"
            sx={{ width: { xs: 180, sm: 260, md: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && userRole !== 'Patient') {
                navigate('/patients');
              }
            }}
          />
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: isMobile ? drawerWidth : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #d8dee9',
            background: 'linear-gradient(180deg, #ffffff 0%, #f7fafc 100%)',
          },
        }}
      >
        <Toolbar sx={{ minHeight: 80 }} />
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, pt: 12, pb: { xs: 11, md: 3 }, width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)` }}>
        {children}
      </Box>

      {isMobile ? (
        <BottomNavigation
          showLabels
          value={location.pathname}
          onChange={(_, value) => navigate(value)}
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: (currentTheme) => currentTheme.zIndex.drawer + 2,
            borderTop: '1px solid #d8dee9',
            backgroundColor: '#ffffff',
            minHeight: 64,
          }}
        >
          {navItems.slice(0, 5).map((item) => (
            <BottomNavigationAction
              key={item.to}
              value={item.to}
              label={item.label.replace('My ', '')}
              icon={item.icon}
              sx={{ minWidth: 64, minHeight: 56 }}
            />
          ))}
        </BottomNavigation>
      ) : null}
    </Box>
  );
}