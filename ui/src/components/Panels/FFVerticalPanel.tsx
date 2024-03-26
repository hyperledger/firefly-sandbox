import { Grid, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';

export const FFVerticalPanel: React.FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();

  return (
    <Grid
      borderRight={`3px solid ${theme.palette.background.paper}`}
      container
      direction="column"
      height="100vh"
      item
      maxHeight={'100vh'}
      sx={{ overflow: 'auto' }}
      xs={4}
    >
      {children}
    </Grid>
  );
};
