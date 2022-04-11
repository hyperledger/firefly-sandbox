import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FF_Paths } from '../../constants/FF_Paths';
import { JsonPayloadContext } from '../../contexts/JsonPayloadContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { ITokenPool, IVerifiers } from '../../interfaces/api';
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../theme';
import { fetchCatcher } from '../../utils/fetches';
import RefreshIcon from '@mui/icons-material/Refresh';

export const TransferForm: React.FC = () => {
  const { selfIdentity, jsonPayload, setJsonPayload, activeForm } =
    useContext(JsonPayloadContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [pool, setPool] = useState<ITokenPool>();
  const [amount, setAmount] = useState<number>(1);
  const [tokenVerifiers, setTokenVerifiers] = useState<IVerifiers[]>([]);
  const [recipient, setRecipient] = useState<string>('');
  const [tokenIndex, setTokenIndex] = useState<string | null>();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    if (activeForm !== 'transfer') return;
    setJsonPayload({
      pool: pool?.name,
      amount,
      tokenIndex,
      to: recipient,
    });
    return;
  }, [pool, amount, recipient, tokenIndex, activeForm]);

  useEffect(() => {
    const qParams = `?limit=25`;
    fetchCatcher(`${FF_Paths.pools}${qParams}`)
      .then((poolRes: ITokenPool[]) => {
        setTokenPools(poolRes);
        if (poolRes.length > 0) {
          setPool(poolRes[0]);
        }
      })
      .catch((err) => {
        reportFetchError(err);
      });

    fetchCatcher(`${FF_Paths.verifiers}`)
      .then((verifiersRes: IVerifiers[]) => {
        setTokenVerifiers(verifiersRes);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [activeForm]);

  useEffect(() => {
    setTokenIndex(isFungible() ? null : '1');
    if (!isFungible()) {
      setAmount(1);
    }
  }, [pool, amount]);

  useEffect(() => {
    if (!pool?.id) return;
    const qParams = `?pool=${pool?.id}&key=${selfIdentity?.ethereum_address}`;
    fetchCatcher(`${FF_Paths.tokenBalances}${qParams}`)
      .then((balanceRes: any) => {
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
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [pool, refresh]);

  const isFungible = () => {
    const selectedPool = tokenPools.find((p) => p.name === pool?.name);
    return selectedPool?.type === 'fungible';
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(event.target.value));
  };

  const handleTokenIndexChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTokenIndex(event.target.value);
  };

  const handleRecipientChange = (
    event: SelectChangeEvent<typeof recipient>
  ) => {
    const {
      target: { value },
    } = event;
    setRecipient(value);
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
            <InputLabel>{t('tokenRecipient')}</InputLabel>
            <Select
              value={recipient}
              onChange={handleRecipientChange}
              input={<OutlinedInput label={t('tokenRecipient')} />}
              renderValue={(selected) => {
                const verifier = tokenVerifiers.find(
                  (v) => v.value === selected
                );
                return `${verifier?.did}`;
              }}
            >
              {tokenVerifiers.map((identity, idx) => (
                <MenuItem key={idx} value={identity.value}>
                  <ListItemText primary={identity.did} />
                </MenuItem>
              ))}
            </Select>
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
        {tokenIndex ? (
          <Grid item xs={4}>
            <FormControl fullWidth required>
              <TextField
                fullWidth
                type="number"
                label={t('tokenIndex')}
                placeholder="ex. 1"
                onChange={handleTokenIndexChange}
              />
            </FormControl>
          </Grid>
        ) : (
          <></>
        )}
        {/* Message
        <MessageTypeGroup
          message={message}
          onSetMessage={(msg: string) => setMessage(msg)}
        /> */}
      </Grid>
    </Grid>
  );
};
