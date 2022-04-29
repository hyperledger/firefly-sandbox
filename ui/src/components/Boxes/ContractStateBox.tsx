import { Launch } from '@mui/icons-material';
import { Grid, IconButton, Link, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SDK_PATHS } from '../../constants/SDK_PATHS';
import { EventContext } from '../../contexts/EventContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { IContractApi, IContractListener } from '../../interfaces/api';
import { fetchCatcher } from '../../utils/fetches';
import { DownloadButton } from '../Buttons/DownloadButton';
import { FFLinearProgress } from '../Loaders/FFLinearProgress';
import { HashPopover } from '../Popovers/HashPopover';
import { FFStateBox } from './FFStateBox';

export const ContractStateBox: React.FC = () => {
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const { refreshAPIs } = useContext(EventContext);
  const [contractApis, setContractApis] = useState<IContractApi[]>();
  const [contractListeners, setContractListeners] =
    useState<IContractListener[]>();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    isMounted &&
      fetchCatcher(`${SDK_PATHS.contractsApi}`)
        .then((apiRes: IContractApi[]) => {
          isMounted && setContractApis(apiRes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [refreshAPIs, isMounted]);

  useEffect(() => {
    setContractListeners([]);
    contractApis?.map((api) => {
      isMounted &&
        fetchCatcher(SDK_PATHS.contractsListenerByApiName(api.name))
          .then((listenerRes: IContractListener[]) => {
            if (isMounted) {
              setContractListeners((prevListeners) => {
                return prevListeners
                  ? [...prevListeners, ...listenerRes]
                  : listenerRes;
              });
            }
          })
          .catch((err) => {
            reportFetchError(err);
          });
    });
  }, [contractApis, isMounted]);

  return (
    <FFStateBox header={t('apisKnownToFirefly')}>
      {/* API List */}
      {!contractApis ? (
        <FFLinearProgress />
      ) : contractApis.length ? (
        contractApis.map((api) => {
          return (
            <Grid
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              container
              pt={1}
              key={api.name}
            >
              {/* API Row */}
              <Grid item xs={8} container pt={1}>
                <HashPopover
                  address={`${SDK_PATHS.contractsApiByName(api.name)}`}
                  fullLength
                  paper
                />
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                item
                xs={4}
                alignItems="center"
              >
                <DownloadButton filename={api.name} url={api.urls.openapi} />
                <Link target="_blank" href={api.urls.ui}>
                  <IconButton>
                    <Launch sx={{ fontSize: '20px' }} />
                  </IconButton>
                </Link>
              </Grid>
              {/* Contract Listeners */}
              <Grid container item>
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
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: '600' }}
                          color="secondary"
                        >{`${t('listener')}: ${l.eventName}; ${t('topic')}: ${
                          l.topic
                        }`}</Typography>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
          );
        })
      ) : (
        <Typography variant="subtitle2" color="secondary">
          {t('noAPIsRegisteredWithFireFly')}
        </Typography>
      )}
    </FFStateBox>
  );
};
