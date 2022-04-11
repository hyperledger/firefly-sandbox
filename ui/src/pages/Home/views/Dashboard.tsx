import { Grid, Paper, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SplitPane from 'react-split-pane';
import { EventSubscription } from './EventSubscription';
import { DEFAULT_PADDING } from '../../../theme';
import { LeftPane } from './LeftPane';
import * as _ from 'underscore';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { MiddlePane } from './MiddlePane';

const styles = {
  background: '#cccccc',
  width: '2px',
  cursor: 'col-resize',
  margin: '0',
  height: '100%',
};

export const HomeDashboard: () => JSX.Element = () => {
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
                <EventSubscription />
              </Grid>
            </SplitPane>
          </SplitPane>
        </Grid>
      </div>
    </>
  );
};
