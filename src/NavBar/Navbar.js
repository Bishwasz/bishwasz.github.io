import React from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/system';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import logo from './logo.png';

const Logo = styled('img')({
  width: '90px',
  height: '40px',
  marginBottom: '10px',
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingTop: '5px', // Reduced padding to make the toolbar shorter
  paddingBottom: '0px', // Reduced padding to make the toolbar shorter
});

const MenuButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  color: theme.palette.text.primary, // Adjust the color based on the theme
  fontWeight: 600,
  fontFamily: '"Encode Sans Condensed", sans-serif',
  fontSize: '1.5em',
  marginRight: '24px',
  // marginBottom: '3px',
  paddingLeft: '4px',
  paddingRight: '32px',
  height: 'calc(1.3em + 3px)',
  overflow: 'hidden',
  transition: 'color 0.3s ease',
  borderRadius: 0, // Make buttons rectangular with no rounded edges
  textTransform: 'none', // Ensure text is not in all capital letters

  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '3px', // Small underline when not hovered
    backgroundColor: theme.palette.text.primary,
    opacity: 0.7,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '0',
    backgroundColor: theme.palette.text.primary,
    transition: 'height 0.3s ease',
    zIndex: -1,
  },
  '&:hover::after': {
    height: '100%',
  },
  '&:hover': {
    color: theme.palette.background.paper,
  },
}));

function Navbar({ isDarkMode, toggleTheme }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isVerySmall = useMediaQuery('(max-width:480px)');
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: isDarkMode 
          ? 'linear-gradient(to bottom, rgba(9, 9, 24, 0.9) 40%, rgba(9, 9, 10, 0.8))' 
          : 'rgba(255, 255, 255, 0.8)', // Gradient background with transparency for dark mode
        boxShadow: 'none', // Removed shadow effect
        color: theme.palette.text.primary, // Ensure text color adjusts
      }}
    >
      <StyledToolbar sx={isMobile ? { padding: '0 50px', paddingTop: '10px' } : {}}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: isMobile ? '5px' : '0px' }}>
          <Logo 
            src={logo} 
            alt="Logo" 
            sx={isVerySmall ? { height: '25px', maxWidth: '60px' } : isMobile ? { height: '10px', maxWidth: '80px' } : {}}
          />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'nowrap', 
          overflow: 'auto', 
          width: '100%', 
          paddingLeft: isMobile ? '30px' : '250px', // Increased left padding to move links to the right
          justifyContent: 'flex-start', // Align items to the start of the container
        }}>
          <MenuButton component={Link} to="/" sx={isMobile ? { fontSize: isVerySmall ? '1em' : '1.2em', marginRight: isVerySmall ? '8px' : '16px' } : {}}>
            Landing
          </MenuButton>
          <MenuButton component={Link} to="/about" sx={isMobile ? { fontSize: isVerySmall ? '1em' : '1.2em', marginRight: isVerySmall ? '8px' : '16px' } : {}}>
            About
          </MenuButton>
          <MenuButton component={Link} to="/blog" sx={isMobile ? { fontSize: isVerySmall ? '1em' : '1.2em', marginRight: isVerySmall ? '8px' : '16px' } : {}}>
            Writing
          </MenuButton>
          <MenuButton component={Link} to="/demos" sx={isMobile ? { fontSize: isVerySmall ? '1em' : '1.2em', marginRight: isVerySmall ? '8px' : '16px' } : {}}>
            Demos
          </MenuButton>
          <IconButton onClick={toggleTheme} color="inherit" sx={{ marginLeft: 'auto', marginBottom:'10px' }}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
}

export default Navbar;
