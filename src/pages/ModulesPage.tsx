import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import type { ModuleCard } from '../types';

type Props = {
  modules: ModuleCard[];
};

export function ModulesPage({ modules }: Props) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk' }}>Full Module Catalog</Typography>
        <Typography color="text.secondary">The platform map for all 20 hospital modules and their implementation phase.</Typography>
      </Box>
      <Grid container spacing={2.5}>
        {modules.map((module) => (
          <Grid item xs={12} md={6} xl={4} key={module.key}>
            <Box sx={{ p: 2.5, borderRadius: 4, background: 'rgba(255,255,255,0.84)', border: '1px solid rgba(15,23,42,0.08)', height: '100%' }}>
              <Stack spacing={1.2}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>{module.title}</Typography>
                  <Chip label={module.phase} size="small" color="primary" />
                </Stack>
                <Typography color="text.secondary">{module.description}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Audience: {module.audience}</Typography>
                <Chip label={module.status} size="small" sx={{ width: 'fit-content', bgcolor: 'rgba(15,118,110,0.1)' }} />
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}