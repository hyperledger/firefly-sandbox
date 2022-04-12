import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SplitPane from 'react-split-pane';
import { DEFAULT_PADDING } from '../../../theme';
import { LeftPane } from './LeftPane';
import { MiddlePane } from './MiddlePane';
import { RightPane } from './RightPane';

export const HomeDashboard: () => JSX.Element = () => {
  const theme = useTheme();

  const styles = {
    background: theme.palette.background.paper,
    width: '2px',
    cursor: 'col-resize',
    margin: '0',
    height: '100%',
  };

  return (
    <>
      <div style={{ height: '100vh', width: '100vw' }}>
        <Grid container height="100%">
          <SplitPane
            split="vertical"
            minSize={100}
            defaultSize={'30%'}
            resizerStyle={styles}
            style={{ position: 'relative' }}
          >
            <LeftPane />
            <SplitPane
              split="vertical"
              minSize={100}
              defaultSize={'50%'}
              resizerStyle={styles}
              style={{ height: '100%' }}
            >
              <div
                style={{ width: '100%', height: '100%', overflow: 'scroll' }}
              >
                <MiddlePane />
              </div>

              <Grid pb={DEFAULT_PADDING} sx={{ height: '100%' }}>
                <RightPane />
              </Grid>
            </SplitPane>
          </SplitPane>
        </Grid>
      </div>
    </>
  );
};
