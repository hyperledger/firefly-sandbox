import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Autocomplete,
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
import { SDK_PATHS } from '../../../constants/SDK_PATHS';
import { TUTORIAL_FORMS } from '../../../constants/TutorialSections';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FormContext } from '../../../contexts/FormContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { ITokenPool, IVerifier } from '../../../interfaces/api';
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../../theme';
import { fetchCatcher } from '../../../utils/fetches';
import { BroadcastForm } from '../Messages/BroadcastForm';
import { PrivateForm } from '../Messages/PrivateForm';

export const TransferForm: React.FC = () => {
  const { selfIdentity, jsonPayload, setJsonPayload, setPayloadMissingFields } =
    useContext(ApplicationContext);
  const { formID } = useContext(FormContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [pool, setPool] = useState<ITokenPool>();
  const [amount, setAmount] = useState<string>('1');
  const [tokenVerifiers, setTokenVerifiers] = useState<IVerifier[]>([]);
  const [recipient, setRecipient] = useState<string>('');
  const [tokenIndex, setTokenIndex] = useState<string | null>('');
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [refresh, setRefresh] = useState<string>('0');
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
    if (formID !== TUTORIAL_FORMS.TRANSFER) {
      resetValues();
      return;
    }
    if (!withMessage) {
      setPayloadMissingFields(
        !recipient || !amount || !pool || (!isFungible() && !tokenIndex)
      );
    }
    const body = {
      pool: pool?.name,
      amount: amount.toString(),
      tokenIndex: tokenIndex?.toString(),
      to: recipient,
      messagingMethod: withMessage ? messageMethod : null,
    };
    setJsonPayload(withMessage ? { ...jsonPayload, ...body } : body);
  }, [pool, amount, recipient, messageMethod, tokenIndex, formID]);

  useEffect(() => {
    const qParams = `?limit=25`;
    if (isMounted) {
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

      fetchCatcher(`${SDK_PATHS.verifiers}`)
        .then((verifiersRes: IVerifier[]) => {
          if (isMounted) {
            const verifiers = verifiersRes;
            setTokenVerifiers(verifiers);
            if (verifiers.length > 0) {
              setRecipient(verifiers[0].value);
            }
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
    }
  }, [formID, isMounted]);

  useEffect(() => {
    if (!isFungible()) {
      setAmount('1');
    }
  }, [pool, amount]);

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

  const isFungible = () => {
    const selectedPool = tokenPools.find((p) => p.name === pool?.name);
    return selectedPool?.type === 'fungible';
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleTokenIndexChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTokenIndex(event.target.value);
  };

  const resetValues = () => {
    setAmount('1');
    setWithMessage(false);
    setRecipient('');
    setTokenIndex('');
    setMessageMethod('broadcast');
  };

  return (
    <Grid container>
      <Grid container spacing={DEFAULT_SPACING}>
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

        <Grid container item>
          {/* Recipient Select box */}
          <FormControl fullWidth required>
            <Autocomplete
              freeSolo
              options={tokenVerifiers.map((identity) => identity.did)}
              renderInput={(params) => (
                <TextField {...params} label={t('tokenRecipient')} />
              )}
              onInputChange={(event, value) => {
                const addressFound = tokenVerifiers.find(
                  (tv) => tv.did === value
                );
                setRecipient(addressFound ? addressFound.value : value);
              }}
            />
          </FormControl>
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
                value={tokenIndex}
                label={t('tokenIndex')}
                placeholder="ex. 1"
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
                      messagingMethod: null,
                      tokenIndex: tokenIndex?.toString(),
                      to: recipient,
                    });
                  }
                  setWithMessage(!withMessage);
                }}
              />
            }
            label={t('transferWithData')}
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
                      messagingMethod: withMessage ? e.target.value : null,
                      tokenIndex: tokenIndex?.toString(),
                      to: recipient,
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
                  !amount ||
                  !pool ||
                  !recipient ||
                  (!isFungible() && !tokenIndex)
                }
              />
            ) : (
              <PrivateForm
                tokenBody={{ ...jsonPayload, messagingMethod: 'private' }}
                tokenMissingFields={
                  !amount ||
                  !pool ||
                  !recipient ||
                  (!isFungible() && !tokenIndex)
                }
              />
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
