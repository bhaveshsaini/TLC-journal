'use client';
import * as React from 'react';
import {
  Box,
  Card,
  CardActions,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTheme, SxProps, alpha } from '@mui/material/styles';
import dayjs from 'dayjs';

const statusMap = {
  profit: { label: 'Profit', color: 'success' },
  loss: { label: 'Loss', color: 'error' },
} as const;

type SortBy = 'ticker' | 'entry' | 'exit' | 'date' | 'profitLoss';

interface TradesProps {
  trades: any[];
  sx?: SxProps;
  onSelectTrade?: (trade: any) => void;
}

export function Trades({ trades = [], sx, onSelectTrade }: TradesProps): React.JSX.Element {
  const theme = useTheme();

  const [sortBy, setSortBy] = React.useState<SortBy>('date');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortBy(event.target.value as SortBy);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const sortedTrades = [...trades].sort((a, b) => {
    const profitLossA = a.exit - a.entry;
    const profitLossB = b.exit - b.entry;

    switch (sortBy) {
      case 'ticker':
        return sortOrder === 'asc'
          ? a.ticker.localeCompare(b.ticker)
          : b.ticker.localeCompare(a.ticker);
      case 'entry':
        return sortOrder === 'asc' ? a.entry - b.entry : b.entry - a.entry;
      case 'exit':
        return sortOrder === 'asc' ? a.exit - b.exit : b.exit - a.exit;
      case 'date':
        return sortOrder === 'asc'
          ? dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix()
          : dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix();
      case 'profitLoss':
        return sortOrder === 'asc' ? profitLossA - profitLossB : profitLossB - profitLossA;
      default:
        return 0;
    }
  });

  return (
    <Card sx={{ ...sx, width: '100%', maxWidth: 600, height: '500px' }}>
      <CardHeader
        title="Trades"
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
                <MenuItem value="ticker">Ticker</MenuItem>
                <MenuItem value="entry">Entry</MenuItem>
                <MenuItem value="exit">Exit</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="profitLoss">Profit/Loss</MenuItem>
              </Select>
            </FormControl>
            <Chip
              label={sortOrder === 'asc' ? '↑' : '↓'}
              onClick={handleSortOrderToggle}
              clickable
              size="small"
            />
          </Box>
        }
      />
      <Divider />
      <Box
        sx={{
          width: '100%',
          maxHeight: '400px',
          overflowY: 'auto',
          overflowX: { xs: 'auto', sm: 'hidden' },
        }}
      >
        <Table
          sx={{
            minWidth: { xs: 500, sm: 600 },
            width: '100%',
            tableLayout: 'auto',
          }}
        >
          <TableHead
            sx={{
              position: 'sticky',
              top: 0,
              backgroundColor: theme.palette.background.paper,
              zIndex: 1,
            }}
          >
            <TableRow>
              <TableCell sx={{fontWeight: 'bold',}}>Ticker</TableCell>
              <TableCell sx={{fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>Entry</TableCell>
              <TableCell sx={{fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>Exit</TableCell>
              <TableCell sx={{fontWeight: 'bold',}} sortDirection={sortBy === 'date' ? sortOrder : false}>Date</TableCell>
              <TableCell sx={{fontWeight: 'bold',}}>Profit/Loss</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">
                    No trades available for this time frame.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedTrades.map((trade, index) => {
                const profitLoss = trade.exit - trade.entry;
                const { label, color } =
                  statusMap[profitLoss > 0 ? 'profit' : 'loss'] ?? { label: 'Unknown', color: 'default' };

                // Alternate row color with dark/light mode support
                const rowBgColor =
                  theme.palette.mode === 'dark'
                    ? index % 2 === 0
                      ? alpha(theme.palette.background.paper, 0.05)
                      : alpha(theme.palette.background.paper, 0.15)
                    : index % 2 === 0
                    ? alpha(theme.palette.grey[100], 1)
                    : alpha(theme.palette.grey[200], 1);

                return (
                  <TableRow
                    hover
                    key={trade._id}
                    onClick={() => onSelectTrade && onSelectTrade(trade)}
                    sx={{
                      backgroundColor: rowBgColor,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.primary.main, 0.15)
                            : alpha(theme.palette.primary.light, 0.4),
                      },
                    }}
                  >
                    <TableCell>{trade.ticker}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      {trade.entry}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      {trade.exit}
                    </TableCell>
                    <TableCell>{dayjs(trade.createdAt).format('MMM D, YYYY')}</TableCell>
                    <TableCell>
                      <Chip color={color} label={label} size="small" sx={{ mr: 1 }} />
                      <span
                        style={{
                          color: profitLoss > 0 ? theme.palette.success.main : theme.palette.error.main,
                          fontWeight: 600,
                        }}
                      >
                        ${profitLoss.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>
      <CardActions sx={{ justifyContent: 'flex-end' }} />
    </Card>
  );
}
