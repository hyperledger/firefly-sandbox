import { Grid, Typography } from '@mui/material';

interface Props {
  content: string | JSX.Element;
  subText: string;
}

export const FFAccordionHeader: React.FC<Props> = ({ content, subText }) => {
  return (
    <Grid container>
      <Grid container alignItems="center">
        {content}
      </Grid>
      <Grid item container>
        <Typography color="secondary" variant="subtitle2">
          {subText}
        </Typography>
      </Grid>
    </Grid>
  );
};
