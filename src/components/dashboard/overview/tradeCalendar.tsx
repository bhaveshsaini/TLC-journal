'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { ArrowLeft, ArrowRight, Calendar } from '@phosphor-icons/react';
import { styled } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';

interface Trade {
  id: string;
  ticker: string;
  entry: number;
  exit: number;
  createdAt: string;
}

const CELL_WIDTH = 100;
const CELL_HEIGHT = 70;

const CalendarGrid = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 0,
  width: '100%',
  height: '100%',
}));

const CalendarCell = styled('div')<{
  isProfit?: boolean;
  isCurrentMonth?: boolean;
}>(({ isProfit, isCurrentMonth }) => ({
  width: `${CELL_WIDTH}px`,
  height: `${CELL_HEIGHT}px`,
  backgroundColor: isCurrentMonth
    ? isProfit === undefined
      ? '#424242'
      : isProfit
      ? '#2e7d32'
      : '#c62828'
    : '#424242', // hide prev/next month cells
  color: isCurrentMonth ? '#fff' : 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2px',
  fontSize: '0.75rem',
  boxSizing: 'border-box',
  '&:hover': {
    backgroundColor:
      isCurrentMonth && isProfit !== undefined
        ? isProfit
          ? '#388e3c'
          : '#e53935'
        : '#a7a5a5ff',
  },
}));

export function TradeCalendar({ trades = [] }: { trades: Trade[] }) {
  const [currentMonth, setCurrentMonth] = React.useState<Dayjs>(dayjs());

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));
  const handleToday = () => setCurrentMonth(dayjs());

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf('month').day();
  const prevMonthDays = currentMonth.subtract(1, 'month').daysInMonth();
  const totalRows = 6;
  const totalSlots = totalRows * 7;

  const calculatePnl = (day: Dayjs) =>
    trades
      .filter(trade => dayjs(trade.createdAt).isSame(day, 'day'))
      .reduce((sum, trade) => sum + (trade.exit - trade.entry), 0);

  // ✅ Only include trades in the currentMonth
  const monthlyPnl = trades
    .filter(trade => dayjs(trade.createdAt).isSame(currentMonth, 'month'))
    .reduce((sum, trade) => sum + (trade.exit - trade.entry), 0);

  return (
    <Card sx={{ width: '100%', height: '100%' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
            <Typography variant="h6">{currentMonth.format('MMMM YYYY')}</Typography>
            <Box>
              <IconButton onClick={handlePrevMonth} sx={{ color: '#fff', p: 0.5 }}>
                <ArrowLeft />
              </IconButton>
              <IconButton onClick={handleNextMonth} sx={{ color: '#fff', p: 0.5 }}>
                <ArrowRight />
              </IconButton>
              <IconButton onClick={handleToday} sx={{ color: '#fff', p: 0.5 }}>
                <Calendar />
              </IconButton>
            </Box>
          </Box>
        }
        subheader={`P/L: $${monthlyPnl.toFixed(2)}`}
        sx={{ backgroundColor: '#2d2d2d', color: '#fff', p: 0.5 }}
      />
      <Divider sx={{ borderColor: '#424242', m: 0 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Weekday Labels */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0, backgroundColor: '#2d2d2d' }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <Box
              key={day}
              sx={{
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: '#fff',
              }}
            >
              {day}
            </Box>
          ))}
        </Box>

        {/* Calendar Days */}
        <CalendarGrid>
          {Array.from({ length: totalSlots }).map((_, idx) => {
            let dayNumber = idx - firstDayOfMonth + 1;
            let isCurrentMonth = true;

            if (idx < firstDayOfMonth) {
              // Previous month days
              dayNumber = prevMonthDays - firstDayOfMonth + idx + 1;
              isCurrentMonth = false;
            } else if (dayNumber > daysInMonth) {
              // Next month days
              dayNumber = dayNumber - daysInMonth;
              isCurrentMonth = false;
            }

            const cellDate = currentMonth.date(dayNumber);
            const pnl = calculatePnl(cellDate);
            const tradeCount = trades.filter(trade => dayjs(trade.createdAt).isSame(cellDate, 'day')).length;

            return (
              <CalendarCell
                key={idx}
                isProfit={tradeCount > 0 ? pnl >= 0 : undefined}
                isCurrentMonth={isCurrentMonth}
              >
                {isCurrentMonth && (
                  <>
                    <Typography variant="caption">{dayNumber}</Typography>
                    {tradeCount > 0 && (
                      <>
                        <Typography variant="body2">${pnl.toFixed(2)}</Typography>
                        <Typography variant="caption">{tradeCount} trades</Typography>
                      </>
                    )}
                  </>
                )}
              </CalendarCell>
            );
          })}
        </CalendarGrid>
      </Box>
    </Card>
  );
}
