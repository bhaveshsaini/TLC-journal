'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';

export interface ProfitLossProps {
  trades: {
    id: string;
    ticker: string;
    entry: number;
    exit: number;
    createdAt: Date;
  }[];
  when?: string; // e.g., "Daily", "Weekly"
  sx?: SxProps;
}

export function ProfitLoss({ trades, sx }: ProfitLossProps): React.JSX.Element {
  const totalPL = trades.reduce((sum, trade) => sum + (trade.exit - trade.entry), 0);

  return (
    <Card sx={{ height: '100%', minHeight: 140, ...sx }}>
      <CardContent sx={{ height: '100%' }}>
        <Stack spacing={3} sx={{ height: '100%' }}>
          <Stack
            direction="row"
            sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
            spacing={3}
          >
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Profit/Loss
              </Typography>
              {/* Lock height so numbers don't change card size */}
              <Typography
                variant="h4"
                sx={{ minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}
              >
                ${totalPL.toFixed(2)}
              </Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: 'var(--mui-palette-primary-main)',
                height: '56px',
                width: '56px',
              }}
            >
              <CurrencyDollarIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
