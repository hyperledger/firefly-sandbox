import { Launch, Refresh } from '@mui/icons-material';
import {
  Grid,
  IconButton,
  Link,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SDK_PATHS } from '../../constants/SDK_PATHS';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { IContractApi, IContractListener } from '../../interfaces/api';
import { DEFAULT_BORDER_RADIUS } from '../../theme';
import { fetchCatcher } from '../../utils/fetches';
import { DownloadButton } from '../Buttons/DownloadButton';
import { HashPopover } from '../Popovers/HashPopover';

export const ContractStateBox: React.FC = () => {
  const { reportFetchError } = useContext(SnackbarContext);
  const theme = useTheme();
  const { t } = useTranslation();

  const [contractApis, setContractApis] = useState<IContractApi[]>();
  const [contractListeners, setContractListeners] =
    useState<IContractListener[]>();
  const [lastRefreshTime, setLastRefreshTime] = useState<string>(
    new Date().toISOString()
  );

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
  }, [lastRefreshTime, isMounted]);

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
    <Grid
      container
      direction="column"
      width="100%"
      p={1}
      sx={{
        border: `3px solid ${theme.palette.background.paper}`,
        borderRadius: DEFAULT_BORDER_RADIUS,
        maxHeight: '250px',
        overflow: 'auto',
      }}
    >
      {/* Header */}
      <Grid container direction="row" item alignItems="center">
        <Grid xs={8} item container>
          <Typography variant="body1" sx={{ fontWeight: '600' }}>
            {t('apisKnownToFirefly')}
          </Typography>
        </Grid>
        <Grid xs={4} item container justifyContent="flex-end">
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
      {/* API List */}
      {!contractApis ? (
        <>
          <Skeleton width={'40%'} />
          <Skeleton width={'50%'} />
        </>
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
        <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
          {t('noAPIsRegisteredWithFireFly')}
        </Typography>
      )}
    </Grid>
  );
};
