import { Grid, Tab, Tabs, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SplitPane from 'react-split-pane';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightBright } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { EventSubscription } from './EventSubscription';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_PADDING,
  FFColors,
} from '../../../theme';
import { LeftPane } from './LeftPane';
import * as _ from 'underscore';

const styles = {
  background: FFColors.Pink,
  width: '4px',
  cursor: 'col-resize',
  margin: '0 5px',
  height: 'auto',
};

export const HomeDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const [displayCodeBlock, setDisplayCodeBlock] = useState<string>('');

  useEffect(() => {
    const fetchCodeBlock = () => {
      return fetch(
        `${window.location.protocol}//${window.location.hostname}:3001/api/simple/template/broadcast`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          const compiled = _.template(data);
          const result = compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            value: 'Hello',
          });
          setDisplayCodeBlock(result);
          console.log(result);
        })
        .catch(() => {
          return null;
        });
    };
    fetchCodeBlock();
  }, []);

  return (
    <>
      <div style={{ height: '100vh', width: '100vw' }}>
        <Grid container px={DEFAULT_PADDING} height="100%">
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
            >
              <Grid container p={DEFAULT_PADDING}>
                <Grid item>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {t('typescriptSDK')}
                  </Typography>
                </Grid>
                <Grid
                  pt={2}
                  container
                  item
                  wrap="nowrap"
                  direction="column"
                  sx={{ borderRadius: DEFAULT_BORDER_RADIUS }}
                  fontSize="12px"
                >
                  <SyntaxHighlighter
                    showLineNumbers
                    language={'typescript'}
                    style={tomorrowNightBright}
                  >
                    {displayCodeBlock}
                  </SyntaxHighlighter>
                </Grid>
              </Grid>
              <Grid pb={DEFAULT_PADDING}>
                <EventSubscription />
              </Grid>
            </SplitPane>
          </SplitPane>
        </Grid>
      </div>
    </>
  );
};
