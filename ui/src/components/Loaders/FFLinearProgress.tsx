import { Grid, LinearProgress } from '@mui/material';
import { DEFAULT_PADDING } from '../../theme';

export const FFLinearProgress: React.FC = () => {
  return (
    <Grid container justifyContent={'center'} py={DEFAULT_PADDING}>
      <LinearProgress
        color="success"
        sx={{ width: '50%', textAlign: 'center' }}
      />
    </Grid>
  );
};
