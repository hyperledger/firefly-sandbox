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
import { ITokenPool, IVerifier } from '../../../interfaces/api';
import { DEFAULT_SPACING } from '../../../theme';
import { fetchCatcher } from '../../../utils/fetches';

export const TransferForm: React.FC = () => {
  const { setJsonPayload, setPayloadMissingFields } =
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

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (formID !== TUTORIAL_FORMS.TRANSFER) {
      setAmount('1');
      return;
    }
    setPayloadMissingFields(
      !recipient || !amount || !pool || (!isFungible() && !tokenIndex)
    );
    setJsonPayload({
      pool: pool?.name,
      amount: amount.toString(),
      tokenIndex: tokenIndex?.toString(),
      to: recipient,
    });
    return;
  }, [pool, amount, recipient, tokenIndex, formID]);

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
                      {tp.name}&nbsp;({tp.symbol})&nbsp;-&nbsp;
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
      </Grid>
    </Grid>
  );
};
