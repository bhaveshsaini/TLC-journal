'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps } from '@mui/material/styles';
import { ChartLineUp } from '@phosphor-icons/react';

type Trade = {
  createdAt: string | Date;
  entry: number;
  exit: number;
};

export interface PerformanceSnapshotProps {
  trades: Trade[];
  sx?: SxProps;
}

export function PerformanceSnapshot({ trades, sx }: PerformanceSnapshotProps) {
  if (trades.length === 0) {
    return (
      <Card sx={{ height: '100%', minHeight: 140, ...sx }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="overline" color="text.secondary">
              Performance Snapshot
            </Typography>
            <Typography variant="h6" color="text.secondary">
              No trades available
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Calculations
  const pnlArray = trades.map(t => t.exit - t.entry);
  const highestDay = Math.max(...pnlArray);
  const lowestDay = Math.min(...pnlArray);
  const totalTrades = trades.length;
  const avgPnL = (pnlArray.reduce((a, b) => a + b, 0) / totalTrades).toFixed(2);

  return (
    <Card sx={{ height: '100%', minHeight: 140, ...sx }}>
      <CardContent>
        <Stack spacing={3} sx={{ height: '100%' }}>
          <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">
                Performance Snapshot
              </Typography>
              <Typography variant="h6">
                Total Trades: {totalTrades}
              </Typography>
              <Typography color="success.main" variant="body1">
                Highest PnL: {highestDay}
              </Typography>
              <Typography color="error.main" variant="body1">
                Lowest PnL: {lowestDay}
              </Typography>
              <Typography color="primary.main" variant="body1">
                Avg PnL: {avgPnL}
              </Typography>
            </Stack>
            <Avatar
              sx={{
                bgcolor: 'var(--mui-palette-primary-main)',
                height: 56,
                width: 56,
              }}
            >
              <ChartLineUp fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
