import { Grid } from '@mui/material';
import { FFVerticalPanel } from '../../../components/Panels/FFVerticalPanel';
import { LeftPane } from './LeftPane';
import { MiddlePane } from './MiddlePane';
import { RightPane } from './RightPane';

export const HomeDashboard: () => JSX.Element = () => {
  return (
    <>
      <Grid container direction="row">
        <FFVerticalPanel>
          <LeftPane />
        </FFVerticalPanel>
        <FFVerticalPanel>
          <MiddlePane />
        </FFVerticalPanel>
        <FFVerticalPanel>
          <RightPane />
        </FFVerticalPanel>
      </Grid>
    </>
  );
};
