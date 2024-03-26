import { Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon from 'react-jazzicon';
import { SDK_PATHS } from '../../constants/SDK_PATHS';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { EventContext } from '../../contexts/EventContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { ITokenBalance } from '../../interfaces/api';
import { decimalToAmount } from '../../utils/decimals';
import { fetchCatcher } from '../../utils/fetches';
import { getShortHash, jsNumberForAddress } from '../../utils/strings';
import { FFLinearProgress } from '../Loaders/FFLinearProgress';
import { FFStateBox } from './FFStateBox';

export const TokenStateBox: React.FC = () => {
  const { selfIdentity } = useContext(ApplicationContext);
  const { refreshBalances } = useContext(EventContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenBalanceMap, setTokenBalanceMap] = useState<{
    [key: string]: { balances: ITokenBalance[] };
  }>();

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
              const balanceArr = balanceMap[b.pool.name]?.balances ?? [];
              balanceMap = {
                ...balanceMap,
                [b.pool.name]: {
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
  }, [isMounted, selfIdentity, refreshBalances]);

  const makeNonFungibleString = (balances: ITokenBalance[]): string => {
    return `${t('total')}: ${balances.length} (${balances
      .sort(
        (a, b) =>
          parseInt(a.tokenIndex ?? '-1') - parseInt(b.tokenIndex ?? '-1'),
      )
      .map((b) => `#${b.tokenIndex ?? ''}`)
      .join(', ')
      .toString()})`;
  };

  return (
    <FFStateBox
      header={`${t('balancesFor')} ${getShortHash(
        selfIdentity?.ethereum_address ?? '',
      )}`}
    >
      {/* Pool list */}
      {!tokenBalanceMap ? (
        <FFLinearProgress />
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
                <Typography>{poolIDKey}</Typography>
                <Typography color={'secondary'} variant="body2">
                  &nbsp;
                  {`(${
                    tokenBalanceMap[poolIDKey].balances.every(
                      (b) => b.tokenIndex === undefined,
                    )
                      ? t('fungible')
                      : t('nonfungible')
                  })`}
                </Typography>
                &nbsp;
                <Typography noWrap>
                  {tokenBalanceMap[poolIDKey].balances.every(
                    (b) => b.tokenIndex !== undefined,
                  )
                    ? makeNonFungibleString(tokenBalanceMap[poolIDKey].balances)
                    : `${t('---')} ${t('total')}: ${decimalToAmount(
                        tokenBalanceMap[poolIDKey].balances[0].balance,
                        tokenBalanceMap[poolIDKey].balances[0].pool.decimals,
                      )}`}
                </Typography>
              </Grid>
            </Grid>
          );
        })
      ) : (
        <Typography variant="subtitle2" color="secondary">
          {t('noBalancesForWallet')}
        </Typography>
      )}
    </FFStateBox>
  );
};
