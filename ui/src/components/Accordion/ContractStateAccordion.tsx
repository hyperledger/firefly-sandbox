import { ExpandMore, Launch, Refresh } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  IconButton,
  Link,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SELECTED_NS } from '../../App';
import { FF_Paths } from '../../constants/FF_Paths';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { IContractApi, IContractListener } from '../../interfaces/api';
import { fetchCatcher } from '../../utils/fetches';
import { DownloadButton } from '../Buttons/DownloadButton';
import { HashPopover } from '../Popovers/HashPopover';
import { FFAccordionText } from './FFAccordionText';

export const ContractStateAccordion: React.FC = () => {
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(true);

  const [contractApis, setContractApis] = useState<IContractApi[]>();
  const [contractListeners, setContractListeners] =
    useState<IContractListener[]>();
  const [lastRefreshTime, setLastRefreshTime] = useState<string>(
    new Date().toISOString()
  );

  useEffect(() => {
    fetchCatcher(`${FF_Paths.api}`)
      .then((apiRes: IContractApi[]) => {
        setContractApis(apiRes);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [lastRefreshTime]);

  useEffect(() => {
    setContractListeners([]);
    contractApis?.map((api) => {
      fetchCatcher(FF_Paths.listenerByApiName(api.name))
        .then((listenerRes: IContractListener[]) => {
          setContractListeners((prevListeners) => {
            return prevListeners
              ? [...prevListeners, ...listenerRes]
              : listenerRes;
          });
        })
        .catch((err) => {
          reportFetchError(err);
        });
    });
  }, [contractApis]);

  return (
    <Accordion
      defaultExpanded
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      {/* Summary */}
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Grid container direction="row" alignItems="center">
          <Grid xs={8} item container justifyContent="flex-start">
            <FFAccordionText
              color="primary"
              isHeader
              text={t('fireflyCurrentState')}
            />
          </Grid>
          <Grid
            xs={4}
            item
            container
            justifyContent="flex-end"
            alignItems="center"
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setLastRefreshTime(new Date().toISOString());
              }}
            >
              <Refresh />
            </IconButton>
          </Grid>
        </Grid>
      </AccordionSummary>
      {/* Details */}
      <AccordionDetails>
        <Grid container justifyContent={'flex-start'} alignItems={'flex-start'}>
          {/* API Section Header */}
          <Grid item container xs={12} direction="row">
            <FFAccordionText text={t('apis')} color="primary" isBold />
          </Grid>
          <Grid item container xs={12} direction="row">
            {contractApis &&
              contractApis.map((api, idx) => {
                return (
                  <React.Fragment key={idx}>
                    {/* API Row */}
                    <Grid container item>
                      <Grid item xs={8} container pt={1}>
                        <HashPopover
                          address={`${FF_Paths.nsPrefix}/${SELECTED_NS}/apis/${api.name}`}
                          fullLength
                        />
                      </Grid>
                      <Grid container justifyContent="flex-end" item xs={4}>
                        <DownloadButton
                          filename={api.name}
                          url={api.urls.openapi}
                        />
                        <Link target="_blank" href={api.urls.ui}>
                          <IconButton>
                            <Launch />
                          </IconButton>
                        </Link>
                      </Grid>
                    </Grid>
                    {/* Contract Listeners */}
                    <Grid container>
                      {contractListeners
                        ?.filter((l) => l.address === api.address)
                        .map((l) => {
                          return (
                            <Grid
                              item
                              pt={1}
                              pl={2}
                              container
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              key={l.id}
                            >
                              <Grid item>
                                <FFAccordionText
                                  text={`${t('listener')}: ${l.eventName}; ${t(
                                    'topic'
                                  )}:${l.topic}`}
                                  color="secondary"
                                />
                              </Grid>
                            </Grid>
                          );
                        })}
                    </Grid>
                  </React.Fragment>
                );
              })}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
