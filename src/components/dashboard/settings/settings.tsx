'use client';
import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ThemeContext } from '@/contexts/theme-context';

export function SettingsPage(): React.JSX.Element {

  const themeCtx = React.useContext(ThemeContext);
  if (!themeCtx) throw new Error('ThemeContext not found');
  const { mode, toggleTheme } = themeCtx;

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Account Section */}
      <Card>
        <CardHeader title="Account" />
        <Divider />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Profile Picture */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src="/assets/avatar.png"
              alt="Profile Picture"
              sx={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ccc' }}
            />
            <Button variant="outlined" component="label">
              Change Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const imgEl = document.querySelector<HTMLImageElement>('img[alt="Profile Picture"]');
                      if (imgEl) imgEl.src = ev.target?.result as string;
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Button>
          </Box>

          <TextField label="Username" defaultValue="John Doe" fullWidth />
          <TextField label="Email" type="email" defaultValue="john@example.com" fullWidth />
          <TextField label="Password" type="password" placeholder="New Password" fullWidth />
          <Button color="error" variant="outlined">Delete Account</Button>
        </CardContent>
      </Card>

      {/* Trading Platforms Section */}
      <Card>
        <CardHeader title="Trading Platforms" />
        <Divider />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography color="text.secondary">Integration with trading platforms is coming soon 🚀</Typography>
        </CardContent>
      </Card>

      {/* Dark Mode Toggle */}
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card>
          <CardHeader title="Appearance" />
          <Divider />
          <CardContent>
            <FormControlLabel
              control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
              label="Dark Mode"
            />
          </CardContent>
        </Card>
      </Box>

      {/* About / App Info */}
      <Card>
        <CardHeader title="About" />
        <Divider />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>Version: 1.0.0</Typography>
          <Button variant="text">Support / Feedback</Button>
          <Button variant="text">Privacy Policy</Button>
        </CardContent>
      </Card>
    </Box>
  );
}
