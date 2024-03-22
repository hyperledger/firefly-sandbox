import {
  Autocomplete,
  FormControl,
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
import { PoolType } from '../../../ff_models/transferTypes';
import { ITokenPool, IVerifier } from '../../../interfaces/api';
import { DEFAULT_SPACING } from '../../../theme';
import { amountToDecimal } from '../../../utils/decimals';
import { fetchCatcher } from '../../../utils/fetches';
import { isAmountInvalid } from '../../../utils/strings';
import { MessageForm } from './MessageForm';

export const TransferForm: React.FC = () => {
  const { jsonPayload, setJsonPayload, setPayloadMissingFields, multiparty } =
    useContext(ApplicationContext);
  const { formID, setPoolObject } = useContext(FormContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [pool, setPool] = useState<ITokenPool>();
  const [amount, setAmount] = useState<string>('1');
  const [decimalAmount, setDecimalAmount] = useState<string | undefined>(
    undefined
  );
  const [tokenVerifiers, setTokenVerifiers] = useState<IVerifier[]>([]);
  const [recipient, setRecipient] = useState<string>('');
  const [tokenIndex, setTokenIndex] = useState<string | null>('');
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
    setPayloadMissingFields(
      !recipient || !amount || !pool || (!isFungible() && !tokenIndex)
    );
    if (decimalAmount === undefined)
      setDecimalAmount(amountToDecimal('1', pool?.decimals));
    const { messagingMethod } = jsonPayload as any;
    const body = {
      pool: pool?.name,
      amount: pool?.type === PoolType.F ? decimalAmount : amount,
      tokenIndex: tokenIndex?.toString(),
      to: recipient,
      messagingMethod: messagingMethod ? messagingMethod : null,
    };
    setJsonPayload(messagingMethod ? { ...jsonPayload, ...body } : body);
  }, [pool, decimalAmount, recipient, tokenIndex, formID]);

  useEffect(() => {
    if (formID !== TUTORIAL_FORMS.TRANSFER) return;
    const qParams = `?limit=25`;
    if (isMounted) {
      fetchCatcher(`${SDK_PATHS.tokensPools}${qParams}`)
        .then((poolRes: ITokenPool[]) => {
          if (isMounted) {
            setTokenPools(poolRes);
            if (poolRes.length > 0) {
              setPool(poolRes[0]);
              setPoolObject(poolRes[0]);
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
            if (verifiers?.length > 0) {
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

  const isFungible = () => {
    const selectedPool = tokenPools.find((p) => p.name === pool?.name);
    return selectedPool?.type === 'fungible';
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (pool && pool.type === PoolType.NF) {
      setAmount(event.target.value);
      return;
    }

    if (!pool || isAmountInvalid(event.target.value)) return;

    const formattedAmount = amountToDecimal(event.target.value, pool?.decimals);
    if (!formattedAmount) return;

    setDecimalAmount(formattedAmount);
    setAmount(event.target.value);
  };

  const handleTokenIndexChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTokenIndex(event.target.value);
  };

  const resetValues = () => {
    setAmount('1');
    setRecipient('');
    setTokenIndex('');
    setJsonPayload({ ...jsonPayload, recipients: null, messagingMethod: null });
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
                onChange={(e) => {
                  setPool(tokenPools.find((t) => t.id === e.target.value));
                  setPoolObject(
                    tokenPools.find((t) => t.id === e.target.value)
                  );
                }}
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
              options={tokenVerifiers?.map((identity) => identity.did) || []}
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
        <Grid item xs={6}>
          <FormControl fullWidth required>
            <TextField
              fullWidth
              value={amount}
              disabled={!isFungible()}
              label={t('amount')}
              placeholder="ex. 10"
              onChange={handleAmountChange}
            />
          </FormControl>
        </Grid>
        {!isFungible() ? (
          <Grid item xs={6}>
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
        {multiparty && (
          <MessageForm
            tokenMissingFields={
              !amount || !pool || !recipient || (!isFungible() && !tokenIndex)
            }
            tokenOperationPayload={{
              pool: pool?.name,
              amount: amount.toString(),
              tokenIndex: tokenIndex?.toString(),
              to: recipient,
            }}
            label={t('attachAMessage')}
          />
        )}
      </Grid>
    </Grid>
  );
};
