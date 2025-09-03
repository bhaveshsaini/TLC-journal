'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { InfoIcon } from '@phosphor-icons/react';
import { ReceiptIcon } from '@phosphor-icons/react/dist/ssr/Receipt';
import dayjs from 'dayjs';

export interface ConsistencyProps {
  trades: {
    id: string;
    ticker: string;
    entry: number;
    exit: number;
    createdAt: Date;
  }[];
  sx?: SxProps;
}

export function Consistency({ trades, sx }: ConsistencyProps): React.JSX.Element {
  if (trades.length === 0) {
    return (
      <Card sx={{ height: '100%', minHeight: 140, ...sx }}>
        <CardContent sx={{ height: '100%' }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography color="text.secondary" variant="overline">
                    Consistency
                  </Typography>
                  <Tooltip
                    title="Consistency is calculated as the longest streak of days with at least one winning trade divided by total trading days in the selected time period."
                    arrow
                  >
                    <IconButton size="small">
                      <InfoIcon size={16} />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Typography
                  variant="h4"
                  sx={{ minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}
                >
                  0%
                </Typography>
              </Stack>
              <Avatar
                sx={{
                  backgroundColor: 'var(--mui-palette-primary-main)',
                  height: '56px',
                  width: '56px',
                }}
              >
                <ReceiptIcon size={32} />
              </Avatar>
            </Stack>
            <LinearProgress value={0} variant="determinate" sx={{ flexShrink: 0 }} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Group trades by date
  const tradesByDate: Record<string, boolean> = {};
  trades.forEach(trade => {
    const date = dayjs(trade.createdAt).format('YYYY-MM-DD');
    if (!tradesByDate[date]) tradesByDate[date] = false;
    if (trade.exit > trade.entry) tradesByDate[date] = true;
  });

  const sortedDates = Object.keys(tradesByDate).sort();

  // Calculate longest streak
  let longestStreak = 0;
  let currentStreak = 0;
  sortedDates.forEach(date => {
    if (tradesByDate[date]) {
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  const consistencyPercent =
    sortedDates.length > 0
      ? Number(((longestStreak / sortedDates.length) * 100).toFixed(2))
      : 0;

  return (
    <Card sx={{ height: '100%', minHeight: 140, ...sx }}>
      <CardContent sx={{ height: '100%' }}>
        <Stack spacing={2} sx={{ height: '100%' }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography color="text.secondary" variant="overline">
                  Consistency
                </Typography>
                <Tooltip
                  title="Consistency is calculated as the longest streak of days with at least one winning trade divided by total trading days in the selected time period."
                  arrow
                >
                  <IconButton size="small">
                    <InfoIcon size={16} />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Typography
                variant="h4"
                sx={{ minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}
              >
                {consistencyPercent}%
              </Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: 'var(--mui-palette-primary-main)',
                height: '56px',
                width: '56px',
              }}
            >
              <ReceiptIcon size={32} />
            </Avatar>
          </Stack>
          <LinearProgress value={consistencyPercent} variant="determinate" sx={{ flexShrink: 0 }} />
        </Stack>
      </CardContent>
    </Card>
  );
}
