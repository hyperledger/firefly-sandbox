import {
  CheckCircleOutline,
  ErrorOutline,
  ExpandMore,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FF_EVENTS, FF_EVENTS_CATEGORY_MAP } from '../../ff_models/eventTypes';
import { IEvent } from '../../interfaces/api';
import { IEventHistoryItem } from '../../interfaces/events';
import { FFColors } from '../../theme';
import { getFFOnlyTime, getFFTime } from '../../utils/time';
import { FFListItem } from '../Lists/FFListItem';
import { HashPopover } from '../Popovers/HashPopover';
import { EventAccordionHeader } from './EventAccordionHeader';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  defaultExpanded: boolean;
  txID: string;
  value: IEventHistoryItem;
}

export const TransactionAccordion: React.FC<Props> = ({
  defaultExpanded,
  txID,
  value,
}) => {
  const { t } = useTranslation();

  return (
    <Accordion defaultExpanded={defaultExpanded}>
      {/* Summary */}
      <AccordionSummary expandIcon={<ExpandMore />} sx={{ py: 0, my: 0 }}>
        {/* Header */}
        <EventAccordionHeader
          leftContent={
            <>
              <Grid item xs={12} container direction="row">
                <Grid item>
                  <Typography
                    component={'span'}
                    sx={{
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                    color="primary"
                    variant="body2"
                    noWrap
                  >
                    {`${t('transaction')}: `}
                  </Typography>
                  <Typography
                    component={'span'}
                    sx={{
                      fontSize: '16px',
                      fontWeight: '500',
                    }}
                    color="secondary"
                    variant="caption"
                    noWrap
                  >
                    {value.txName}
                  </Typography>
                </Grid>
                {value.showIcons && (
                  <Grid item pl={1}>
                    {!value.isComplete ? (
                      <CircularProgress color="warning" size="20px" />
                    ) : !value.isFailed ? (
                      <CheckCircleOutline sx={{ color: FFColors.Green }} />
                    ) : (
                      <ErrorOutline color={'error'} />
                    )}
                  </Grid>
                )}
              </Grid>
              {value.showTxHash && (
                <Grid item xs={12} pt={1}>
                  <HashPopover address={txID} />
                </Grid>
              )}
            </>
          }
          rightContent={
            <FFAccordionText
              text={getFFTime(value.created)}
              color={'secondary'}
            />
          }
        />
      </AccordionSummary>
      {/* Details */}
      <AccordionDetails>
        {value.events.map((e: IEvent, idx: number) => {
          return (
            <React.Fragment key={e.id}>
              {/* Event section */}
              <Grid
                pt={idx !== 0 ? 1 : 0}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Grid item xs={6}>
                  <FFAccordionText
                    text={t(
                      FF_EVENTS_CATEGORY_MAP[e.type as FF_EVENTS].nicename
                    )}
                    color={'primary'}
                    isBold
                  />
                </Grid>
                <Grid container justifyContent="flex-end" item pl={1} xs={6}>
                  <FFAccordionText
                    text={getFFOnlyTime(e.created)}
                    color={'secondary'}
                  />
                </Grid>
              </Grid>
              {/* Event key: values */}
              <Grid item xs={12} container>
                {FF_EVENTS_CATEGORY_MAP[e.type as FF_EVENTS]
                  .eventKeyList(e as IEvent)
                  .map(
                    (d) =>
                      d.label !== '' && (
                        <FFListItem key={d.label.toString()} item={d} />
                      )
                  )}
              </Grid>
              {idx !== value.events.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};
