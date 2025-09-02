import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/system';
import { Brightness4, Brightness7 } from '@mui/icons-material';

import logo from './logo.png';

const Logo = styled('img')({
  marginBottom: '10px',
});

const MenuButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontFamily: '"Encode Sans Condensed", sans-serif',
  overflow: 'hidden',
  transition: 'color 0.3s ease',
  borderRadius: 0,
  textTransform: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '3px',
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

const getMenuButtonStyles = (isVerySmall, isMobile) => ({
  fontSize: isVerySmall ? '1em' : isMobile ? '1.2em' : '1.5em',
  marginRight: isVerySmall ? '4px' : isMobile ? '8px' : '16px',
  paddingLeft: isVerySmall ? '2px' : '4px',
  paddingRight: isVerySmall ? '8px' : isMobile ? '12px' : '24px',
  height: isVerySmall ? 'calc(1em + 3px)' : isMobile ? 'calc(1.2em + 3px)' : 'calc(1.3em + 3px)',
  paddingTop: '0px',
  paddingBottom: '0px',
});

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
          : 'rgba(255, 255, 255, 0.8)',
        boxShadow: 'none',
        color: theme.palette.text.primary,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Desktop-only brightness icon */}
      {!isMobile && (
        <IconButton
          onClick={toggleTheme}
          color="inherit"
          sx={{
            position: 'absolute',
            top: 8,
            right: 16,
            zIndex: 10,
            padding: '12px',
          }}
        >
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      )}

      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '10px 20px 0 20px' : '5px 250px 0 250px',
          minHeight: 'auto',
        }}
      >
        {/* Logo section */}
        <Box
          sx={{
            width: isMobile ? 'auto' : '100%',
            display: 'flex',
            justifyContent: isMobile ? 'flex-start' : 'center',
            alignItems: 'center',
            marginBottom: isMobile ? '0px' : '5px',
          }}
        >
          <Logo
            src={logo}
            alt="Logo"
            sx={{
              height: isVerySmall ? '25px' : isMobile ? '30px' : '40px',
              maxWidth: isVerySmall ? '60px' : isMobile ? '80px' : '90px',
              marginRight: isMobile ? '16px' : '0',
            }}
          />
        </Box>

        {/* Menu and icon container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            paddingRight: isMobile ? 0 : '250px',
            paddingLeft: isMobile ? 0 : '250px',
          }}
        >
          {/* Menu section */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              minWidth: 'fit-content',
              scrollPaddingLeft: '8px',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              ...(isMobile
                ? {}
                : {
                    maxWidth: '900px',
                    margin: '0 auto',
                    transform: 'translateX(-60px)',
                  }),
            }}
          >
            <MenuButton component={Link} to="/" sx={getMenuButtonStyles(isVerySmall, isMobile)}>
              Landing
            </MenuButton>
            <MenuButton component={Link} to="/about" sx={getMenuButtonStyles(isVerySmall, isMobile)}>
              About
            </MenuButton>
            <MenuButton component={Link} to="/blog" sx={getMenuButtonStyles(isVerySmall, isMobile)}>
              Writing
            </MenuButton>
            <MenuButton component={Link} to="/demos" sx={getMenuButtonStyles(isVerySmall, isMobile)}>
              Demos
            </MenuButton>
          </Box>

          {/* Mobile-only brightness icon placed at far right */}
          {isMobile && (
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{
                ml: 'auto',
                padding: '8px',
              }}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
