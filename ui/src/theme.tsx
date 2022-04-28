import { ThemeOptions } from '@mui/material';

export const DEFAULT_BORDER_RADIUS = '8px';
export const DEFAULT_HIST_HEIGHT = 175;
export const DEFAULT_TIMELINE_HEIGHT = 500;
export const DEFAULT_PADDING = 3;
export const DEFAULT_PAGE_LIMITS = [5, 10, 25];
export const DEFAULT_SPACING = 3;

export enum FFColors {
  Green = '#4af04a',
  Orange = '#ff8a00',
  Pink = '#cc01ab',
  Purple = '#6b00f2',
  Red = '#e1111e',
  Yellow = '#ffca00',
  White = '#FFFFFF',
}

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      default: '#12171d',
      paper: '#1e242a',
    },
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#9BA7B0',
      dark: '#252C32',
    },
    info: {
      main: FFColors.Pink,
    },
    success: {
      main: FFColors.Purple,
    },
    warning: {
      main: FFColors.Yellow,
    },
    error: {
      main: FFColors.Red,
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#9BA7B0',
      disabled: '#51565a',
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#12171d',
          width: '100%',
          borderRadius: DEFAULT_BORDER_RADIUS,
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          borderRadius: DEFAULT_BORDER_RADIUS,
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderRadius: DEFAULT_BORDER_RADIUS,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          fontSize: '12px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#462DE0',
          color: '#fff',
          ':hover': {
            backgroundColor: '#231770',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: '14px',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflow: 'overlay',
          scrollbarColor: '#12171d',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            cursor: 'pointer',
            backgroundColor: '#12171d',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#1e242a',
            border: '3px solid #12171d',
          },
        },
      },
    },
  },
};
