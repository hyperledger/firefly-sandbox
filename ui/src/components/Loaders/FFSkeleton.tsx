import { Grid, Skeleton } from '@mui/material';

interface Props {
  numLines: number;
}

export const FFSkeleton: React.FC<Props> = ({ numLines }) => {
  return (
    <Grid p={1} pl={2} item my={2}>
      {Array.from(Array(numLines)).map((_, idx) => (
        <Skeleton
          sx={{ fontSize: '12px' }}
          width={`${Math.floor(Math.random() * 60) + 25}%`}
          key={idx}
        />
      ))}
    </Grid>
  );
};
