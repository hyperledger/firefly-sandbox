import { Grid, Paper, Slide, Typography } from '@mui/material';
import * as React from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionAccordion } from '../../../components/Accordion/TransactionAccordion';
import { FFPanelHeader } from '../../../components/Panels/FFPanelHeader';
import { EventContext } from '../../../contexts/EventContext';
import { DEFAULT_BORDER_RADIUS, DEFAULT_PADDING } from '../../../theme';

export const RightPane: React.FC = () => {
  const { t } = useTranslation();
  const { logHistory } = useContext(EventContext);

  return (
    <Grid>
      <FFPanelHeader title={t('events')} />
      <Grid container item p={DEFAULT_PADDING} pt={0} direction="column">
        {logHistory.size > 0 ? (
          Array.from(logHistory.entries())
            .reverse()
            .map(([txID, value], idx) => (
              <Grid pb={1} key={txID} width="100%">
                {idx === 0 ? (
                  <Slide in={idx === 0} direction="left">
                    <div>
                      <TransactionAccordion
                        txID={txID}
                        value={value}
                        defaultExpanded={true}
                      />
                    </div>
                  </Slide>
                ) : (
                  <TransactionAccordion
                    txID={txID}
                    value={value}
                    defaultExpanded={false}
                  />
                )}
              </Grid>
            ))
        ) : (
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              backgroundColor: 'background.paper',
              borderRadius: DEFAULT_BORDER_RADIUS,
              p: DEFAULT_PADDING,
            }}
          >
            <Typography>{t('eventsSubmittedWillShowHere')}</Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};
