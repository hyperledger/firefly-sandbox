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
    mode: 'light',
    background: {
      default: '#E2E2E2',
      paper: '#FFFFFF',
    },
    primary: {
      main: '#462DE0',
    },
    secondary: {
      main: '#A73DD5',
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
      primary: '#251A7B',
      secondary: '#462DE0',
      disabled: '#51565a',
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          width: '100%',
          borderRadius: '8px',
          '&:before': {
            display: 'none',
          },
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
  },
};