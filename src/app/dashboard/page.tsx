'use client';
import * as React from 'react';
import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  TextField,
} from '@mui/material';
import { Plus, X, DownloadSimple, UploadSimple } from '@phosphor-icons/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { ProfitLoss } from '@/components/dashboard/overview/profitLoss';
import { WinRate } from '@/components/dashboard/overview/winRate';
import { Consistency } from '@/components/dashboard/overview/consistency';
import { Trades } from '@/components/dashboard/overview/trades';
import { TradeCalendar } from '@/components/dashboard/overview/tradeCalendar';
import { PerformanceSnapshot } from '@/components/dashboard/overview/performanceStats';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'all';

export default function Page(): React.JSX.Element {
  const [timeFrame, setTimeFrame] = React.useState<TimeFrame>('all');
  const [trades, setTrades] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedTrade, setSelectedTrade] = React.useState<any | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'winners' | 'losers'>('all');

  // --- new state for form ---
  const [ticker, setTicker] = React.useState('');
  const [entry, setEntry] = React.useState('');
  const [exit, setExit] = React.useState('');
  const [strategy, setStrategy] = React.useState('');
  const [comments, setComments] = React.useState('');

  const handleTimeFrameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeFrame(event.target.value as TimeFrame);
  };

  useEffect(() => {
    async function fetchTrades() {
      const res = await fetch("/api/trades");
      const data = await res.json();
      setTrades(data)
    }
  
    fetchTrades()
  }, [])

  const handleAddTrade = async () => {
    const newTrade = {
      ticker,
      entry: Number(entry),
      exit: Number(exit),
      strategy,
      comments,
      createdAt: new Date(),
    };

    try {
    await fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTrade),
    });
      setTrades(prev => [...prev, newTrade]);

    } catch (err) {
      console.error(err);
    }

    setOpenModal(false);
    setTicker('');
    setEntry('');
    setExit('');
    setStrategy('');
    setComments('');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(trades, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trades.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = JSON.parse(ev.target?.result as string);
        setTrades(data);
      };
      reader.readAsText(file);
    }
  };

  const filterTradesByTimeFrame = (trades: typeof initialTrades, frame: TimeFrame) => {
    const now = dayjs();
    switch (frame) {
      case 'daily':
        return trades.filter(trade => dayjs(trade.createdAt).isSame(now, 'day'));
      case 'weekly':
        return trades.filter(trade => dayjs(trade.createdAt).isSame(now, 'week'));
      case 'monthly':
        return trades.filter(trade => dayjs(trade.createdAt).isSame(now, 'month'));
      case 'all':
      default:
        return trades;
    }
  };

  const filteredTrades = filterTradesByTimeFrame(trades, timeFrame).filter(t => {
    const pnl = t.exit - t.entry;
    if (filter === 'winners') return pnl > 0;
    if (filter === 'losers') return pnl < 0;
    return true;
  });

  const chartData = {
    labels: filteredTrades.map(t => dayjs(t.createdAt).format('MM/DD')),
    datasets: [
      {
        label: 'Cumulative PnL',
        data: filteredTrades.reduce((acc: number[], t, i) => {
          const prev = acc[i - 1] || 0;
          return [...acc, prev + (t.exit - t.entry)];
        }, []),
        borderColor: '#1976d2',
        backgroundColor: 'transparent',
      },
    ],
  };

  return (
    <Box sx={{ paddingX: 3, paddingTop: 1, minHeight: '100vh' }}>
      {/* Top 4 components */}
      <Grid container spacing={3} alignItems="stretch" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <ProfitLoss trades={filteredTrades} sx={{ height: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <WinRate trades={filteredTrades} sx={{ height: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Consistency trades={filteredTrades} sx={{ height: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <PerformanceSnapshot trades={filteredTrades} sx={{ height: '100%' }} />
        </Grid>
      </Grid>

      {/* Controls */}
      <Grid container spacing={3} sx={{ mb: 2 }} alignItems="center">
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', md: 'flex-end' },
          }}
        >
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Time Frame</InputLabel>
            <Select value={timeFrame} onChange={handleTimeFrameChange}>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="winners">Winners</MenuItem>
              <MenuItem value="losers">Losers</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<DownloadSimple />} onClick={handleExport}>
            Export
          </Button>
          <Button component="label" variant="outlined" startIcon={<UploadSimple />}>
            Import
            <input type="file" hidden onChange={handleImport} />
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => setOpenModal(true)}
          >
            Add Trade
          </Button>
        </Grid>
      </Grid>

      {/* Trades Table & Calendar */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={4}>
          <Trades trades={filteredTrades} onSelectTrade={setSelectedTrade} sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={12} lg={8}>
          <Box sx={{ overflowX: 'auto' }}>
            <TradeCalendar trades={trades} sx={{ minWidth: 400, width: '100%' }} />
          </Box>
        </Grid>
      </Grid>

      {/* Performance Chart */}
      <Box sx={{ mt: 3, overflowX: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Performance Over Time
        </Typography>
        <Box sx={{ minWidth: 400 }}>
          <Line data={chartData} />
        </Box>
      </Box>

      {/* Add Trade Modal */}
<Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
  <DialogContent>
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Ticker"
        value={ticker}
        onChange={e => setTicker(e.target.value)}
      />
      <TextField
        label="Entry Price"
        value={entry}
        onChange={e => setEntry(e.target.value)}
        type="number"
      />
      <TextField
        label="Exit Price"
        value={exit}
        onChange={e => setExit(e.target.value)}
        type="number"
      />
      <TextField
        label="Strategy"
        value={strategy}
        onChange={e => setStrategy(e.target.value)}
      />
      <TextField
        label="Comments"
        value={comments}
        onChange={e => setComments(e.target.value)}
        multiline
        rows={3}
      />
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={() => setOpenModal(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleAddTrade}
          disabled={
            !ticker ||
            !entry ||
            !exit
          }
        >
          Save Trade
        </Button>
      </Box>
    </Box>
  </DialogContent>
</Dialog>


      {/* Trade Details Modal */}
      {selectedTrade && (
        <Dialog open={!!selectedTrade} onClose={() => setSelectedTrade(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Trade Details
            <IconButton onClick={() => setSelectedTrade(null)}><X /></IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography>Ticker: {selectedTrade.ticker}</Typography>
            <Typography>Entry: {selectedTrade.entry}</Typography>
            <Typography>Exit: {selectedTrade.exit}</Typography>
            <Typography>PnL: {selectedTrade.exit - selectedTrade.entry}</Typography>
            <Typography>Strategy: {selectedTrade.strategy}</Typography>
            <Typography>Date: {dayjs(selectedTrade.createdAt).format('MMM D, YYYY')}</Typography>
            <Typography>Comments: {selectedTrade.comments || '—'}</Typography>
            {selectedTrade.screenshots?.length > 0 && (
              <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                {selectedTrade.screenshots.map((s: any, i: number) => (
                  <img key={i} src={s.url} alt={s.name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                ))}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}
