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
import { FF_Paths } from '../../constants/FF_Paths';
import { JsonPayloadContext } from '../../contexts/JsonPayloadContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { ITokenPool, IVerifiers } from '../../interfaces/api';
import { DEFAULT_SPACING } from '../../theme';
import { fetchCatcher } from '../../utils/fetches';
import {
  DEFAULT_MESSAGE_STRING,
  // MessageTypeGroup,
} from '../Buttons/MessageTypeGroup';
import { RunButton } from '../Buttons/RunButton';

export const MintForm: React.FC = () => {
  const { jsonPayload, setJsonPayload, activeForm } =
    useContext(JsonPayloadContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [recipient, setRecipient] = useState<string>('');

  const [message, setMessage] = useState<string | object | undefined>(
    DEFAULT_MESSAGE_STRING
  );

  const [pool, setPool] = useState<string>();
  const [amount, setAmount] = useState<number>();

  useEffect(() => {
    if (activeForm !== 'mint') {
      return;
    }
    if (!message) {
      setJsonPayload({
        pool: pool,
        amount: amount,
      });
      return;
    }

    setJsonPayload({
      pool: pool,
      amount: amount,
      message: {
        data: [
          {
            value: message,
          },
        ],
      },
    });
  }, [pool, amount, message, activeForm]);

  useEffect(() => {
    if (activeForm !== 'mint') return;
    const qParams = `?limit=25`;
    fetchCatcher(`${FF_Paths.pools}${qParams}`)
      .then((poolRes: ITokenPool[]) => {
        setTokenPools(poolRes);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [activeForm]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setAmount(undefined);
      return;
    }
    setAmount(parseInt(event.target.value));
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
        <Grid item xs={4}>
          <FormControl fullWidth required>
            <TextField
              fullWidth
              type="number"
              label={t('amount')}
              placeholder={t('exampleAmount')}
              onChange={handleAmountChange}
            />
          </FormControl>
        </Grid>
        {/* Message */}
        {/* <MessageTypeGroup
          message={message}
          onSetMessage={(msg: string | object) => setMessage(msg)}
        /> */}
      </Grid>
    </Grid>
  );
};
