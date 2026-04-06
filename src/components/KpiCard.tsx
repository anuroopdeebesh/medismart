import { Card, CardContent, Stack, Typography } from '@mui/material';

type Props = {
  label: string;
  value: string | number;
  caption?: string;
  accent?: string;
};

export function KpiCard({ label, value, caption, accent = '#0f766e' }: Props) {
  return (
    <Card sx={{ height: '100%', border: '1px solid #d8dee9', background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)', position: 'relative', overflow: 'hidden' }}>
      <Typography sx={{ position: 'absolute', top: -24, right: -12, fontSize: 96, color: `${accent}22`, fontFamily: 'Space Grotesk', fontWeight: 700, lineHeight: 1 }}>
        +
      </Typography>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="overline" sx={{ letterSpacing: 1.2, color: '#64748b' }}>
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk', color: accent, textShadow: '0 0 18px rgba(15,118,110,0.14)' }}>
            {value}
          </Typography>
          {caption ? <Typography variant="body2" color="#64748b">{caption}</Typography> : null}
        </Stack>
      </CardContent>
    </Card>
  );
}