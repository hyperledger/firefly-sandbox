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
import { SELECTED_NAMESPACE } from '../../App';
import { FF_Paths } from '../../constants/FF_Paths';
import { JsonPayloadContext } from '../../contexts/JsonPayloadContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { ITokenPool } from '../../interfaces/api';
import { DEFAULT_SPACING } from '../../theme';
import { fetchCatcher } from '../../utils/fetches';
import {
  DEFAULT_MESSAGE_STRING,
  MessageTypeGroup,
} from '../Buttons/MessageTypeGroup';
import { RunButton } from '../Buttons/RunButton';

export const MintForm: React.FC = () => {
  const { jsonPayload, setJsonPayload, activeForm } =
    useContext(JsonPayloadContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [message, setMessage] = useState<string | object | undefined>(
    DEFAULT_MESSAGE_STRING
  );

  const [pool, setPool] = useState<string>();
  const [amount, setAmount] = useState<string>();
  const [toAddress, setToAddress] = useState<string>();

  useEffect(() => {
    if (activeForm !== 'mint') {
      return;
    }
    if (!message) {
      setJsonPayload({
        pool: pool,
        amount: amount,
        to: toAddress,
      });
      return;
    }

    setJsonPayload({
      pool: pool,
      amount: amount,
      to: toAddress,
      message: {
        data: [
          {
            value: message,
          },
        ],
      },
    });
  }, [pool, amount, toAddress, message, activeForm]);

  useEffect(() => {
    const qParams = `?limit=25`;
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${SELECTED_NAMESPACE}${FF_Paths.tokenPools}${qParams}`
    )
      .then((poolRes: ITokenPool[]) => {
        setTokenPools(poolRes);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, []);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setAmount(undefined);
      return;
    }
    setAmount(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setToAddress(undefined);
      return;
    }
    setToAddress(event.target.value);
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
                      {tp.name}&nbsp;-&nbsp;
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
        <Grid container item justifyContent="space-between" spacing={1}>
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <TextField
                fullWidth
                label={t('tokenRecipient')}
                placeholder={t('exampleAddress')}
                onChange={handleAddressChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
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
        </Grid>
        {/* Message */}
        <MessageTypeGroup
          message={message}
          onSetMessage={(msg: string | object) => setMessage(msg)}
        />
        <Grid container item justifyContent="flex-end">
          <RunButton
            endpoint={`${FF_Paths.nsPrefix}/${SELECTED_NAMESPACE}${FF_Paths.tokenMint}`}
            payload={jsonPayload}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
