import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
import { DEFAULT_BORDER_RADIUS } from '../../theme';

interface Props {
  header: string;
}

export const FFStateBox: React.FC<Props> = ({ header, children }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      direction="column"
      width="100%"
      p={1}
      sx={{
        border: `3px solid ${theme.palette.background.paper}`,
        borderRadius: DEFAULT_BORDER_RADIUS,
      }}
    >
      {/* Header */}
      <Grid container direction="row" item alignItems="center">
        <Typography variant="body1" sx={{ fontWeight: '600' }}>
          {header}
        </Typography>
      </Grid>
      <Grid
        container
        direction="column"
        width="100%"
        p={1}
        sx={{
          maxHeight: '222px',
          overflow: 'auto',
          flexWrap: 'nowrap',
        }}
      >
        {children}
      </Grid>
    </Grid>
  );
};
