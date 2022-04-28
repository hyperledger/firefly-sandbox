import { Refresh } from '@mui/icons-material';
import {
  Grid,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon from 'react-jazzicon';
import { SDK_PATHS } from '../../constants/SDK_PATHS';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { ITokenBalance } from '../../interfaces/api';
import { DEFAULT_BORDER_RADIUS } from '../../theme';
import { decimalToAmount } from '../../utils/decimals';
import { fetchCatcher } from '../../utils/fetches';
import { getShortHash, jsNumberForAddress } from '../../utils/strings';

export const TokenStateBox: React.FC = () => {
  const theme = useTheme();
  const { selfIdentity } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenBalanceMap, setTokenBalanceMap] = useState<{
    [key: string]: { balances: ITokenBalance[] };
  }>();
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
      fetchCatcher(`${SDK_PATHS.tokensBalances}`)
        .then((balanceRes: ITokenBalance[]) => {
          if (isMounted) {
            let balanceMap: {
              [key: string]: { balances: ITokenBalance[] };
            } = {};
            balanceRes.forEach((b) => {
              if (b.key !== selfIdentity?.ethereum_address) {
                return;
              }
              const balanceArr = balanceMap[b.poolObject.name]?.balances ?? [];
              balanceMap = {
                ...balanceMap,
                [b.poolObject.name]: {
                  balances: [...balanceArr, b],
                },
              };
            });
            setTokenBalanceMap(balanceMap);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [lastRefreshTime, isMounted, selfIdentity]);

  const makeNonFungibleString = (balances: ITokenBalance[]): string => {
    return `${t('total')}: ${balances.length} (${balances
      .sort(
        (a, b) =>
          parseInt(a.tokenIndex ?? '-1') - parseInt(b.tokenIndex ?? '-1')
      )
      .map((b) => `#${b.tokenIndex ?? ''}`)
      .join(', ')
      .toString()})`;
  };

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
      <Grid direction="row" container item alignItems="center">
        <Grid container item xs={8}>
          <Typography variant="body1" sx={{ fontWeight: '600' }}>{`${t(
            'balancesFor'
          )} ${getShortHash(
            selfIdentity?.ethereum_address ?? ''
          )}`}</Typography>
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
      {/* Pool list */}
      {!tokenBalanceMap ? (
        <>
          <Skeleton width={'40%'} />
          <Skeleton width={'50%'} />
        </>
      ) : Object.keys(tokenBalanceMap).length ? (
        Object.keys(tokenBalanceMap).map((poolIDKey) => {
          return (
            <Grid
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              container
              pt={1}
              key={poolIDKey}
            >
              <Grid container item justifyContent="flex-start" xs={1}>
                <Jazzicon diameter={20} seed={jsNumberForAddress(poolIDKey)} />
              </Grid>
              <Grid
                container
                item
                justifyContent="flex-start"
                xs={11}
                alignItems="center"
              >
                <Typography sx={{ fontSize: '14px' }}>{poolIDKey}</Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                  }}
                  color={'secondary'}
                  variant="body2"
                >
                  &nbsp;
                  {`(${
                    tokenBalanceMap[poolIDKey].balances.every(
                      (b) => b.tokenIndex === undefined
                    )
                      ? t('fungible')
                      : t('nonfungible')
                  })`}
                </Typography>
                &nbsp;
                <Typography
                  sx={{
                    fontSize: '14px',
                  }}
                  noWrap
                >
                  {tokenBalanceMap[poolIDKey].balances.every(
                    (b) => b.tokenIndex !== undefined
                  )
                    ? makeNonFungibleString(tokenBalanceMap[poolIDKey].balances)
                    : `${t('---')} ${t('total')}: ${decimalToAmount(
                        tokenBalanceMap[poolIDKey].balances[0].balance,
                        tokenBalanceMap[poolIDKey].balances[0].poolObject
                          .decimals
                      )}`}
                </Typography>
              </Grid>
            </Grid>
          );
        })
      ) : (
        <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
          {t('noBalancesForWallet')}
        </Typography>
      )}
    </Grid>
  );
};
