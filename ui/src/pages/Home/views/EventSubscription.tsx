import { Box, Grid, Paper, Typography } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { DEFAULT_PADDING } from '../../../theme';
import * as React from 'react';
import { JsonPayloadContext } from '../../../contexts/JsonPayloadContext';

export const EventSubscription: React.FC = () => {
  const { t } = useTranslation();
  const { logs } = React.useContext(JsonPayloadContext);

  return (
    <div style={{ width: '100%' }}>
      <Grid pb={DEFAULT_PADDING}>
        <Grid
          item
          p={DEFAULT_PADDING}
          sx={{
            background: '#12171d',
            height: 'auto',
            position: 'sticky',
            top: '0',
            zIndex: '1000001',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('events')}
          </Typography>
        </Grid>
        <Grid container item p={DEFAULT_PADDING} pt={0}>
          <Paper
            sx={{
              width: '100%',
              minHeight: '400px',
            }}
          >
            <Grid container p={2}>
              <Grid container item p={1}>
                <Box
                  component="div"
                  sx={{
                    whiteSpace: 'normal',
                    height: 'auto',
                  }}
                >
                  <Typography
                    align="left"
                    style={{
                      fontSize: '12px',
                      maxWidth: '450px',
                      maxHeight: '450px',
                      wordWrap: 'break-word',
                      overflow: 'scroll',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {logs.length === 0
                      ? 'Subscribe to events to view logs.'
                      : logs}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
