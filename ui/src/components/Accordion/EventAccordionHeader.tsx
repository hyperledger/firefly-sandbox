import { Grid } from '@mui/material';

interface Props {
  leftContent: string | JSX.Element;
  rightContent?: string | JSX.Element;
}

export const EventAccordionHeader: React.FC<Props> = ({
  leftContent,
  rightContent,
}) => {
  return (
    <Grid container direction="row" alignItems="center">
      <Grid xs={8} item container justifyContent="flex-start">
        {leftContent}
      </Grid>
      <Grid xs={4} item container justifyContent="flex-end" alignItems="center">
        {rightContent}
      </Grid>
    </Grid>
  );
};
