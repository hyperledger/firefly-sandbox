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
import { PoolType } from '../../../ff_models/transferTypes';
import { ITokenPool } from '../../../interfaces/api';
import { DEFAULT_SPACING } from '../../../theme';
import { amountToDecimal } from '../../../utils/decimals';
import { fetchCatcher } from '../../../utils/fetches';
import { isAmountInvalid } from '../../../utils/strings';
import { MessageForm } from './MessageForm';

export const MintForm: React.FC = () => {
  const { jsonPayload, setJsonPayload, setPayloadMissingFields, multiparty } =
    useContext(ApplicationContext);
  const { formID, setPoolObject } = useContext(FormContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);

  const [pool, setPool] = useState<ITokenPool>();
  const [amount, setAmount] = useState<string>('1');
  const [tokenIndex, setTokenIndex] = useState<string>('1');
  const [decimalAmount, setDecimalAmount] = useState<string | undefined>(
    undefined,
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (formID !== TUTORIAL_FORMS.MINT) {
      resetValues();
      return;
    }

    setPayloadMissingFields(!amount || !pool);

    if (decimalAmount === undefined)
      setDecimalAmount(amountToDecimal('1', pool?.decimals));
    const { messagingMethod } = jsonPayload as any;
    const body = {
      pool: pool?.name,
      amount: pool?.type === PoolType.F ? decimalAmount : amount,
      tokenIndex: pool?.type === PoolType.NF ? tokenIndex : '',
      messagingMethod: messagingMethod ? messagingMethod : null,
    };
    setJsonPayload(messagingMethod ? { ...jsonPayload, ...body } : body);
  }, [pool, decimalAmount, tokenIndex, formID]);

  useEffect(() => {
    if (formID !== TUTORIAL_FORMS.MINT) return;
    const qParams = `?limit=25`;
    isMounted &&
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
  }, [formID, isMounted]);

  const resetValues = () => {
    setAmount('1');
    setJsonPayload({ ...jsonPayload, recipients: null, messagingMethod: null });
  };

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
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (
      !pool ||
      pool.type !== PoolType.NF ||
      isAmountInvalid(event.target.value)
    )
      return;
    setTokenIndex(event.target.value);
  };

  return (
    <Grid container>
      <Grid container spacing={DEFAULT_SPACING}>
        <Grid container item justifyContent="space-between" spacing={1}>
          <Grid item width="100%" xs={10}>
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
                    tokenPools.find((t) => t.id === e.target.value),
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
          <Grid item xs={2}>
            <FormControl fullWidth required>
              <TextField
                fullWidth
                label={t('amount')}
                placeholder={t('exampleAmount')}
                value={amount}
                disabled={pool?.type === PoolType.NF}
                onChange={handleAmountChange}
              />
            </FormControl>
          </Grid>
          {!isFungible() && (
            <Grid item xs={10} mt={2}>
              <FormControl fullWidth required>
                <TextField
                  fullWidth
                  label={t('tokenIndex')}
                  placeholder={t('exampleTokenIndex')}
                  value={tokenIndex}
                  onChange={handleTokenIndexChange}
                />
              </FormControl>
            </Grid>
          )}
        </Grid>
        {multiparty && (
          <MessageForm
            tokenMissingFields={!amount || !pool}
            tokenOperationPayload={{
              pool: pool?.name,
              amount: amount.toString(),
              tokenIndex: pool?.type === PoolType.NF ? tokenIndex : '',
            }}
            label={t('attachAMessage')}
          />
        )}
      </Grid>
    </Grid>
  );
};
