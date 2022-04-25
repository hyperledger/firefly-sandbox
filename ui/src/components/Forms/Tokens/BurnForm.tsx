import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { ITokenPool } from '../../../interfaces/api';
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../../theme';
import { fetchCatcher } from '../../../utils/fetches';
import RefreshIcon from '@mui/icons-material/Refresh';
import { TUTORIAL_FORMS } from '../../../constants/TutorialSections';
import { SDK_PATHS } from '../../../constants/SDK_PATHS';
import { FormContext } from '../../../contexts/FormContext';
import { BroadcastForm } from '../Messages/BroadcastForm';
import { PrivateForm } from '../Messages/PrivateForm';

export const BurnForm: React.FC = () => {
  const { selfIdentity, jsonPayload, setJsonPayload, setPayloadMissingFields } =
    useContext(ApplicationContext);
  const { formID } = useContext(FormContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [pool, setPool] = useState<ITokenPool>();
  const [amount, setAmount] = useState<string>('0');
  const [tokenIndex, setTokenIndex] = useState<string | null>('');
  const [refresh, setRefresh] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [withMessage, setWithMessage] = useState<boolean>(false);
  const [messageMethod, setMessageMethod] = useState<string>('broadcast');

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (formID !== TUTORIAL_FORMS.BURN) {
      resetValues();
      return;
    }
    if (!withMessage) {
      setPayloadMissingFields(
        !amount || !pool || (!isFungible() && !tokenIndex)
      );
    }
    const body = {
      pool: pool?.name,
      amount: amount.toString(),
      tokenIndex: tokenIndex?.toString(),
      messagingMethod: withMessage ? messageMethod : null,
    };
    setJsonPayload(withMessage ? { ...jsonPayload, ...body } : body);
  }, [pool, amount, tokenIndex, formID]);

  useEffect(() => {
    const qParams = `?limit=25`;
    isMounted &&
      fetchCatcher(`${SDK_PATHS.tokensPools}${qParams}`)
        .then((poolRes: ITokenPool[]) => {
          if (isMounted) {
            setTokenPools(poolRes);
            if (poolRes.length > 0) {
              setPool(poolRes[0]);
            }
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [formID, isMounted]);

  useEffect(() => {
    if (!pool?.id) return;
    const qParams = `?pool=${pool?.id}&key=${selfIdentity?.ethereum_address}`;
    isMounted &&
      fetchCatcher(`${SDK_PATHS.tokensBalances}${qParams}`)
        .then((balanceRes: any) => {
          if (isMounted) {
            if (pool.type === 'nonfungible') {
              setTokenBalance(balanceRes.length);
            } else {
              setTokenBalance(
                balanceRes.length > 0
                  ? balanceRes.find(
                      (b: any) => b.key === selfIdentity?.ethereum_address
                    ).balance
                  : 0
              );
            }
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [pool, refresh, isMounted]);

  useEffect(() => {
    if (!isFungible()) {
      setAmount('1');
    }
  }, [pool, amount]);

  const isFungible = () => {
    const selectedPool = tokenPools.find((p) => p.name === pool?.name);
    return selectedPool?.type === 'fungible';
  };

  const handleTokenIndexChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTokenIndex(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const resetValues = () => {
    setAmount('1');
    setWithMessage(false);
    setMessageMethod('broadcast');
  };

  return (
    <Grid container>
      <Grid container spacing={DEFAULT_SPACING}>
        {/* Token Pools */}
        <Grid container item justifyContent="space-between" spacing={1}>
          <Grid item width="100%">
            <FormControl
              fullWidth
              required
              disabled={tokenPools.length ? false : true}
            >
              <InputLabel>
                {tokenPools.length ? t('tokenPool') : t('noTokenPools')}
              </InputLabel>
              <Select
                fullWidth
                value={pool?.id ?? ''}
                label={tokenPools.length ? t('tokenPool') : t('noTokenPools')}
                onChange={(e) =>
                  setPool(tokenPools.find((t) => t.id === e.target.value))
                }
              >
                {tokenPools.map((tp, idx) => (
                  <MenuItem key={idx} value={tp.id}>
                    <Typography color="primary">
                      {tp.name}
                      {tp.symbol ? `(${tp.symbol}) - ` : ' - '}
                      {tp.type === 'fungible'
                        ? t('fungible')
                        : t('nonfungible')}
                    </Typography>
                    <Typography color="text.disabled" fontSize="small">
                      {tp.standard}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {t('tokenBalance')}: {tokenBalance}
          <Button
            sx={{ marginLeft: DEFAULT_PADDING }}
            onClick={() => {
              setRefresh(refresh + 1);
            }}
          >
            <RefreshIcon
              sx={{
                cursor: 'pointer',
              }}
            ></RefreshIcon>
          </Button>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth required>
            <TextField
              fullWidth
              value={amount}
              disabled={!isFungible()}
              type="number"
              label={t('amount')}
              placeholder="ex. 10"
              onChange={handleAmountChange}
            />
          </FormControl>
        </Grid>
        {!isFungible() ? (
          <Grid item xs={4}>
            <FormControl fullWidth required>
              <TextField
                fullWidth
                label={t('tokenIndex')}
                placeholder="ex. 1"
                value={tokenIndex}
                onChange={handleTokenIndexChange}
              />
            </FormControl>
          </Grid>
        ) : (
          <></>
        )}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={withMessage}
                onChange={() => {
                  if (withMessage) {
                    setJsonPayload({
                      pool: pool?.name,
                      amount: amount.toString(),
                      tokenIndex: tokenIndex?.toString(),
                      messagingMethod: null,
                    });
                  }
                  setWithMessage(!withMessage);
                }}
              />
            }
            label={t('burnWithData')}
          />
        </Grid>
        {withMessage === true && (
          <>
            <Grid item width="100%">
              <FormControl fullWidth required>
                <InputLabel>{t('messagingMethod')}</InputLabel>
                <Select
                  fullWidth
                  value={messageMethod}
                  label={t('messagingMethod')}
                  onChange={(e) => {
                    setMessageMethod(e.target.value);
                    setJsonPayload({
                      pool: pool?.name,
                      amount: amount.toString(),
                      tokenIndex: tokenIndex?.toString(),
                      messagingMethod: withMessage ? e.target.value : null,
                    });
                  }}
                >
                  <MenuItem key={'messageMethod-broadcast'} value={'broadcast'}>
                    {t('broadcast')}
                  </MenuItem>
                  <MenuItem key={'messageMethod-private'} value={'private'}>
                    {t('private')}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
        {withMessage === true && (
          <Grid container item>
            {messageMethod === 'broadcast' ? (
              <BroadcastForm
                tokenBody={{ ...jsonPayload, messagingMethod: 'broadcast' }}
                tokenMissingFields={
                  !amount || !pool || (!isFungible() && !tokenIndex)
                }
              />
            ) : (
              <PrivateForm
                tokenBody={{ ...jsonPayload, messagingMethod: 'private' }}
                tokenMissingFields={
                  !amount || !pool || (!isFungible() && !tokenIndex)
                }
              />
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
