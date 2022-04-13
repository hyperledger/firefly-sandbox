import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon from 'react-jazzicon';
import { FF_Paths } from '../../constants/FF_Paths';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { ITokenBalance } from '../../interfaces/api';
import { fetchCatcher } from '../../utils/fetches';
import { jsNumberForAddress } from '../../utils/strings';
import { HashPopover } from '../Popovers/HashPopover';
import { FFAccordionText } from './FFAccordionText';

export const TokenStateAccordion: React.FC = () => {
  const { selfIdentity } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(true);

  const [tokenBalances, setTokenBalances] = useState<ITokenBalance[]>();
  const [tokenBalanceMap, setTokenBalanceMap] = useState<{
    [key: string]: { balances: ITokenBalance[] };
  }>({});

  useEffect(() => {
    fetchCatcher(`${FF_Paths.tokenBalances}`)
      .then((balanceRes: ITokenBalance[]) => {
        setTokenBalances(
          balanceRes.filter((b) => b.key === selfIdentity?.ethereum_address)
        );

        let balanceMap: {
          [key: string]: { balances: ITokenBalance[] };
        } = {};
        balanceRes.map((b) => {
          const balanceArr = balanceMap[b.pool]?.balances ?? [];

          balanceMap = {
            ...balanceMap,
            [b.pool]: {
              balances: [...balanceArr, b],
            },
          };
        });
        setTokenBalanceMap(balanceMap);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, []);

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
    <Accordion
      defaultExpanded
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      {/* Summary */}
      <AccordionSummary expandIcon={<ExpandMore />}>
        <FFAccordionText
          color="primary"
          isHeader
          text={t('fireflyCurrentState')}
        />
      </AccordionSummary>
      {/* Details */}
      <AccordionDetails>
        <Grid container justifyContent={'flex-start'} alignItems={'flex-start'}>
          {/* Balances Section Header */}
          <Grid item container xs={12} direction="row" alignItems={'flex-end'}>
            <FFAccordionText
              text={`${t('balancesFor')}:`}
              color="primary"
              isBold
            />
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: '500',
                paddingBottom: 0,
              }}
              color={'primary'}
              variant="body2"
              noWrap
            >
              &nbsp;
              {selfIdentity?.ethereum_address}
            </Typography>
          </Grid>
          <Grid item container xs={12} direction="row">
            {tokenBalances &&
              Object.keys(tokenBalanceMap).map((poolIDKey, idx) => {
                return (
                  <React.Fragment key={idx}>
                    {/* Pool balances */}
                    <Grid
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      container
                      pt={1}
                    >
                      <Grid container item justifyContent="flex-start" xs={1}>
                        <Jazzicon
                          diameter={20}
                          seed={jsNumberForAddress(poolIDKey)}
                        />
                      </Grid>
                      <Grid
                        container
                        item
                        justifyContent="flex-start"
                        xs={11}
                        alignItems="center"
                      >
                        <HashPopover address={poolIDKey} />
                        <Typography
                          sx={{
                            paddingLeft: 2,
                            fontSize: '14px',
                            fontWeight: '500',
                            paddingBottom: 0,
                          }}
                          color={'secondary'}
                          variant="body2"
                          noWrap
                        >
                          {`(${
                            tokenBalanceMap[poolIDKey].balances.every(
                              (b) => b.tokenIndex === undefined
                            )
                              ? t('nonfungible')
                              : t('fungible')
                          })`}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* Amount in pool */}
                    <Grid
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      container
                      pt={1}
                    >
                      <Grid
                        container
                        pl={6}
                        pb={1}
                        item
                        justifyContent="flex-start"
                        xs={11}
                        alignItems="center"
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: '500',
                            paddingBottom: 0,
                          }}
                        >
                          {tokenBalanceMap[poolIDKey].balances.every(
                            (b) => b.tokenIndex !== undefined
                          )
                            ? makeNonFungibleString(
                                tokenBalanceMap[poolIDKey].balances
                              )
                            : `${t('total')}: ${
                                tokenBalanceMap[poolIDKey].balances[0].balance
                              }`}
                        </Typography>
                      </Grid>
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
