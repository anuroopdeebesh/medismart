import { createTheme, alpha } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const medismartTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0b8a83', contrastText: '#ffffff' },
    secondary: { main: '#1d6fd6', contrastText: '#ffffff' },
    background: { default: '#f3f8fb', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' },
    divider: '#d7e1ea',
  },
  typography: {
    fontFamily: ['Manrope', 'sans-serif'].join(','),
    fontSize: 16,
    h1: { fontFamily: ['Space Grotesk', 'sans-serif'].join(','), fontWeight: 700 },
    h2: { fontFamily: ['Space Grotesk', 'sans-serif'].join(','), fontWeight: 700 },
    h3: { fontFamily: ['Space Grotesk', 'sans-serif'].join(','), fontWeight: 700 },
    h4: { fontFamily: ['Space Grotesk', 'sans-serif'].join(','), fontWeight: 700 },
    h5: { fontFamily: ['Space Grotesk', 'sans-serif'].join(','), fontWeight: 700 },
    h6: { fontFamily: ['Space Grotesk', 'sans-serif'].join(','), fontWeight: 700 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.95rem', lineHeight: 1.55 },
  },
  shape: { borderRadius: 18 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at 12% 18%, rgba(11,138,131,0.10), transparent 30%), radial-gradient(circle at 88% 8%, rgba(29,111,214,0.09), transparent 28%), linear-gradient(180deg, #fbfdff 0%, #f1f7fb 100%)',
          color: '#0f172a',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          border: '1px solid #d7e1ea',
          boxShadow: `0 14px 30px ${alpha('#0f172a', 0.07)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #d7e1ea',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 12,
          borderColor: '#c9d7e4',
          minHeight: 44,
          paddingInline: 16,
        },
        contained: {
          background: 'linear-gradient(135deg, #0b8a83 0%, #0ea5a0 100%)',
          color: '#ffffff',
          border: '1px solid #0b8a83',
        },
        outlined: {
          color: '#0f172a',
          borderColor: '#c9d7e4',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: '#0f172a',
          backgroundColor: '#ffffff',
          minHeight: 44,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c9d7e4',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0b8a83',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#475569',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(242,249,252,0.98) 100%)',
          borderBottom: '1px solid #d7e1ea',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #ffffff 0%, #f3f9fc 100%)',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderColor: '#d7e1ea',
          color: '#0f172a',
          backgroundColor: '#ffffff',
        },
        columnHeaders: {
          borderBottomColor: '#d7e1ea',
          backgroundColor: '#f2f9fc',
        },
        cell: {
          borderBottomColor: '#e4ecf3',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          border: '1px solid #cfe1ea',
          backgroundColor: '#f4fbfd',
        },
      },
    },
  },
});