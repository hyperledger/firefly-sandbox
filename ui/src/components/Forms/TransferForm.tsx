import {
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
import { SELECTED_NAMESPACE } from '../../App';
import { FF_Paths } from '../../constants/FF_Paths';
import { JsonPayloadContext } from '../../contexts/JsonPayloadContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { ITokenPool, IVerifiers } from '../../interfaces/api';
import { DEFAULT_SPACING } from '../../theme';
import { fetchCatcher } from '../../utils/fetches';
import {
  DEFAULT_MESSAGE_STRING,
  MessageTypeGroup,
} from '../Buttons/MessageTypeGroup';
import { RunButton } from '../Buttons/RunButton';

export const TransferForm: React.FC = () => {
  const { jsonPayload, setJsonPayload, activeForm } =
    useContext(JsonPayloadContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [pool, setPool] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const [tokenVerifiers, setTokenVerifiers] = useState<IVerifiers[]>([]);
  const [recipient, setRecipient] = useState<string>('');
  const [tokenIndex, setTokenIndex] = useState<number | null>();

  useEffect(() => {
    if (activeForm !== 'transfer') return;
    setJsonPayload({
      pool,
      amount,
      tokenIndex,
      to: recipient,
    });
    return;
  }, [pool, amount, recipient, activeForm]);

  useEffect(() => {
    const qParams = `?limit=25`;
    fetchCatcher(`${FF_Paths.tokenPools}${qParams}`)
      .then((poolRes: ITokenPool[]) => {
        setTokenPools(poolRes);
      })
      .catch((err) => {
        reportFetchError(err);
      });

    fetchCatcher(`${FF_Paths.tokenVerifiers}`)
      .then((verifiersRes: IVerifiers[]) => {
        setTokenVerifiers(verifiersRes);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, []);

  useEffect(() => {
    setTokenIndex(isFungible() ? null : 1);
    if (!isFungible()) {
      setAmount(1);
    }
  }, [pool]);

  const isFungible = () => {
    const selectedPool = tokenPools.find((p) => p.name === pool);
    return selectedPool?.type === 'fungible';
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setAmount(undefined);
      return;
    }
    setAmount(parseInt(event.target.value));
  };

  const handleTokenIndexChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.length === 0) {
      setAmount(undefined);
      return;
    }
    setTokenIndex(parseInt(event.target.value));
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
                value={pool ?? ''}
                label={tokenPools.length ? t('tokenPool') : t('noTokenPools')}
                onChange={(e) => setPool(e.target.value as string)}
              >
                {tokenPools.map((tp, idx) => (
                  <MenuItem key={idx} value={tp.name}>
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
        {tokenIndex && (
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
        )}
        {/* Message
        <MessageTypeGroup
          message={message}
          onSetMessage={(msg: string | object) => setMessage(msg)}
        /> */}
        <Grid container item justifyContent="flex-end">
          <RunButton
            endpoint={`${FF_Paths.tokenTransfers}`}
            payload={jsonPayload}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
