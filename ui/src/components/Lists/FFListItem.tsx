import { Grid, Typography } from '@mui/material';
import { IDataListItem } from '../../interfaces/ff';

interface Props {
  item: IDataListItem;
}

export const FFListItem: React.FC<Props> = ({ item }) => {
  return (
    <Grid
      xs={12}
      py={0.5}
      sx={{
        minHeight: '20px',
      }}
      container
      item
      alignItems="center"
    >
      <Grid item xs={3}>
        <Typography noWrap color="secondary" sx={{ fontSize: 12 }}>
          {item.label}
        </Typography>
      </Grid>
      <Grid item xs={9}>
        {item.value}
      </Grid>
    </Grid>
  );
};
