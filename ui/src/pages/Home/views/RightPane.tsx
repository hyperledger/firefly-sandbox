import { CheckCircleOutline, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import * as React from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { EventAccordionHeader } from '../../../components/Accordion/EventAccordionHeader';
import { FFAccordionText } from '../../../components/Accordion/FFAccordionText';
import { FFListItem } from '../../../components/Lists/FFListItem';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { EventContext } from '../../../contexts/EventContext';
import {
  FF_EVENTS,
  FF_EVENTS_CATEGORY_MAP,
} from '../../../ff_models/eventTypes';
import { IEvent } from '../../../interfaces/api';
import { DEFAULT_BORDER_RADIUS, DEFAULT_PADDING } from '../../../theme';
import { getFFOnlyTime, getFFTime } from '../../../utils/time';

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
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('events')}
          </Typography>
        </Grid>
        <Grid container item p={DEFAULT_PADDING} pt={0}>
          {logHistory.size > 0 ? (
            Array.from(logHistory.entries())
              .reverse()
              .map(([txID, value], idx) => (
                <Grid pb={1} key={idx} width="100%">
                  <Accordion
                    defaultExpanded={idx === 0}
                    sx={{ paddingBottom: 1 }}
                  >
                    {/* Summary */}
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <EventAccordionHeader
                        leftContent={
                          <>
                            <Grid
                              container
                              justifyContent={'flex-start'}
                              alignItems={'flex-start'}
                            >
                              <Grid item xs={12} container direction="row">
                                <FFAccordionText
                                  text={t('transactionID')}
                                  color="primary"
                                  isHeader
                                />

                                <Grid item pl={1}>
                                  {!value.isComplete ? (
                                    <CircularProgress
                                      color="warning"
                                      size="20px"
                                    />
                                  ) : (
                                    <CheckCircleOutline color="success" />
                                  )}
                                </Grid>
                              </Grid>
                              <Grid item xs={12} pt={1}>
                                <HashPopover address={txID} />
                              </Grid>
                            </Grid>
                          </>
                        }
                        rightContent={
                          <Grid
                            container
                            justifyContent={'flex-end'}
                            alignItems="center"
                          >
                            <Grid item>
                              <FFAccordionText
                                text={getFFTime(value.created)}
                                color={'secondary'}
                              />
                            </Grid>
                          </Grid>
                        }
                      />
                    </AccordionSummary>
                    {/* Details */}
                    <AccordionDetails>
                      {value.events.map((e: IEvent, idx: number) => {
                        return (
                          <React.Fragment key={idx}>
                            {/* Event section */}
                            <Grid
                              pt={1}
                              container
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                            >
                              <Grid item xs={6}>
                                <FFAccordionText
                                  text={t(
                                    FF_EVENTS_CATEGORY_MAP[e.type as FF_EVENTS]
                                      .nicename
                                  )}
                                  color={'primary'}
                                  isBold
                                />
                              </Grid>
                              <Grid
                                container
                                justifyContent="flex-end"
                                item
                                pl={1}
                                xs={6}
                              >
                                <FFAccordionText
                                  text={getFFOnlyTime(e.created)}
                                  color={'secondary'}
                                />
                              </Grid>
                            </Grid>
                            {/* Event key: values */}
                            <Grid>
                              <Grid item xs={12} container>
                                {FF_EVENTS_CATEGORY_MAP[e.type as FF_EVENTS]
                                  .eventKeyList(e as IEvent)
                                  .map(
                                    (d, idx) =>
                                      d.label !== '' && (
                                        <FFListItem key={idx} item={d} />
                                      )
                                  )}
                              </Grid>
                            </Grid>
                            {idx !== value.events.length - 1 && <Divider />}
                          </React.Fragment>
                        );
                      })}
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))
          ) : (
            <Grid
              container
              justifyContent={'center'}
              alignItems="center"
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: DEFAULT_BORDER_RADIUS,
              }}
            >
              <Grid p={DEFAULT_PADDING}>
                <Typography>{t('eventsSubmittedWillShowHere')}</Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};
