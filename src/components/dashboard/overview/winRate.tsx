'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { PercentIcon } from '@phosphor-icons/react/dist/ssr/Percent';

export interface WinRateProps {
  trades: {
    id: string;
    ticker: string;
    entry: number;
    exit: number;
    createdAt: Date;
  }[];
  sx?: SxProps;
}

export function WinRate({ trades, sx }: WinRateProps): React.JSX.Element {
  const totalTrades = trades.length;
  const winningTrades = trades.filter(trade => trade.exit > trade.entry).length;
  const value = totalTrades > 0 ? Number(((winningTrades / totalTrades) * 100).toFixed(2)) : 0;

  return (
    <Card sx={{ height: '100%', minHeight: 140, ...sx }}>
      <CardContent sx={{ height: '100%' }}>
        <Stack spacing={2} sx={{ height: '100%' }}>
          <Stack
            direction="row"
            sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
            spacing={3}
          >
            <Stack spacing={1}>
              <Typography color="text.secondary" gutterBottom variant="overline">
                Win Rate %
              </Typography>
              {/* Fixed height so digits don’t push card size */}
              <Typography
                variant="h4"
                sx={{ minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}
              >
                {value}%
              </Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: 'var(--mui-palette-warning-main)',
                height: '56px',
                width: '56px',
              }}
            >
              <PercentIcon size={32} />
            </Avatar>
          </Stack>
          <LinearProgress value={value} variant="determinate" sx={{ flexShrink: 0 }} />
        </Stack>
      </CardContent>
    </Card>
  );
}
