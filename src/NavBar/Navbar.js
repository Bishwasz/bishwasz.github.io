// Navbar.jsx
import { useState } from 'react';
import { AppBar, Toolbar, Box, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import { Brightness4, Brightness7, Menu as MenuIcon } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const links = [
  // { label: 'Landing', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Writing', to: '/blog' },
  { label: 'Demos', to: '/demos' },
];

const linkStyle = (theme) => ({
  color: theme.palette.text.link,
  textDecoration: 'none',
  fontWeight: 600,
  position: 'relative',
  px: 1.5,
  py: 0.5,
  overflow: 'hidden',
  transition: 'color 0.3s ease',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    bgcolor: theme.palette.text.primary,
    transform: 'translateY(100%)',
    transition: 'transform 0.3s ease',
    zIndex: -1,
  },
  
  '&:hover': {
    color: theme.palette.background.default,
  },
  
  '&:hover::before': {
    transform: 'translateY(0)',
  },
});

export default function Navbar({ isDarkMode, toggleTheme }) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.navbar',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', py: 2, gap: 3 }}>
        <Box 
          component={NavLink} 
          to="/" 
          sx={{ 
            color: 'text.primary', 
            textDecoration: 'none' 
          }}
        >
          <Typography fontWeight={600}>Bishwas</Typography>
        </Box>

        {/* Desktop links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, ml: 'auto' }}>
          {links.map(({ label, to }) => (
            <Box key={to} component={NavLink} to={to} sx={linkStyle}>{label}</Box>
          ))}
        </Box>

        <IconButton 
          onClick={toggleTheme} 
          sx={{ 
            ml: { xs: 'auto', md: 0 },
            color: 'text.primary'
          }}
        >
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* Mobile menu button */}
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ 
            display: { xs: 'flex', md: 'none' },
            color: 'text.primary'
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Dropdown menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {links.map(({ label, to }) => (
            <MenuItem
              key={to}
              component={NavLink}
              to={to}
              onClick={() => setAnchorEl(null)}
              sx={{
                color: 'text.primary',
                '&.active': { bgcolor: 'action.selected' },
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}