import { Grid, Typography } from '@mui/material';
import { DEFAULT_PADDING } from '../../theme';

interface Props {
  title: string;
}

export const FFPanelHeader: React.FC<Props> = ({ title }) => {
  return (
    <Grid
      container
      item
      p={DEFAULT_PADDING}
      pt={2}
      direction="row"
      alignItems={'center'}
    >
      <Typography variant="h3" sx={{ fontWeight: 600, fontSize: '28px' }}>
        {title}
      </Typography>
    </Grid>
  );
};
