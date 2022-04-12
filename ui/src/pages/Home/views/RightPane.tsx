import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import * as React from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { EventContext } from '../../../contexts/EventContext';
import {
  FF_EVENTS,
  FF_EVENTS_CATEGORY_MAP,
} from '../../../ff_models/eventTypes';
import { DEFAULT_PADDING } from '../../../theme';

export const RightPane: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { logHistory } = useContext(EventContext);

  return (
    <div style={{ width: '100%', overflow: 'scroll', height: '100%' }}>
      <Grid pb={DEFAULT_PADDING}>
        <Grid
          item
          p={DEFAULT_PADDING}
          sx={{
            background: theme.palette.background.default,
            height: 'auto',
            position: 'sticky',
            top: '0',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('events')}
          </Typography>
        </Grid>
        <Grid container item p={DEFAULT_PADDING} pt={0}>
          {Object.keys(logHistory).map((k, idx) => {
            return (
              <Accordion key={idx} defaultExpanded={idx === 0}>
                <AccordionSummary>{k}</AccordionSummary>
                <AccordionDetails>
                  {logHistory[k].events.map((e, idx) => {
                    return (
                      <Typography key={idx}>
                        {FF_EVENTS_CATEGORY_MAP[e.type as FF_EVENTS].nicename}
                      </Typography>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
};
