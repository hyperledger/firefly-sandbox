import {
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
import { ITokenPool } from '../../../interfaces/api';
import { DEFAULT_SPACING } from '../../../theme';
import { amountToDecimal } from '../../../utils/decimals';
import { fetchCatcher } from '../../../utils/fetches';
import { isAmountInvalid } from '../../../utils/strings';
import { MessageForm } from './MessageForm';

export const BurnForm: React.FC = () => {
  const { jsonPayload, setJsonPayload, setPayloadMissingFields } =
    useContext(ApplicationContext);
  const { formID } = useContext(FormContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [pool, setPool] = useState<ITokenPool>();
  const [amount, setAmount] = useState<string>('1');
  const [decimalAmount, setDecimalAmount] = useState<string | undefined>(
    undefined
  );
  const [tokenIndex, setTokenIndex] = useState<string | null>('');

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
    setPayloadMissingFields(!amount || !pool || (!isFungible() && !tokenIndex));
    if (pool) {
      if (decimalAmount === undefined)
        setDecimalAmount(amountToDecimal('1', pool.decimals));
      const { messagingMethod } = jsonPayload as any;
      const body = {
        pool: pool?.name,
        amount: decimalAmount,
        tokenIndex: tokenIndex?.toString(),
        messagingMethod: messagingMethod ? messagingMethod : null,
      };
      console.log(messagingMethod, jsonPayload, body);
      setJsonPayload(messagingMethod ? { ...jsonPayload, ...body } : body);
    }
  }, [pool, decimalAmount, tokenIndex, formID]);

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
    if (!pool || isAmountInvalid(event.target.value)) return;

    const formattedAmount = amountToDecimal(event.target.value, pool?.decimals);
    if (!formattedAmount) return;

    setDecimalAmount(formattedAmount);
    setAmount(event.target.value);
  };

  const resetValues = () => {
    setAmount('1');
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
        <MessageForm
          tokenMissingFields={
            !amount || !pool || (!isFungible() && !tokenIndex)
          }
          tokenOperationPayload={{
            pool: pool?.name,
            amount: amount.toString(),
            tokenIndex: tokenIndex?.toString(),
          }}
          label={t('attachAMessage')}
        />
      </Grid>
    </Grid>
  );
};
