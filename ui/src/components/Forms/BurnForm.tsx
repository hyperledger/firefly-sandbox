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

export const BurnForm: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { jsonPayload, setJsonPayload } = useContext(JsonPayloadContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [message, setMessage] = useState<string | object | undefined>(
    DEFAULT_MESSAGE_STRING
  );
  const [pool, setPool] = useState<string>();
  const [amount, setAmount] = useState<string>();
  const [fromAddress, setFromAddress] = useState<string>();

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!message) {
      setJsonPayload({
        pool: pool,
        amount: amount,
        from: fromAddress,
      });
      return;
    }

    setJsonPayload({
      pool: pool,
      amount: amount,
      from: fromAddress,
      message: {
        data: [
          {
            value: message,
          },
        ],
      },
    });
  }, [pool, amount, fromAddress, message]);

  useEffect(() => {
    const qParams = `?limit=25`;
    isMounted &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${SELECTED_NAMESPACE}${FF_Paths.tokenPools}${qParams}`
      )
        .then((poolRes: ITokenPool[]) => {
          if (isMounted) {
            setTokenPools(poolRes);
          }
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
      setFromAddress(undefined);
      return;
    }
    setFromAddress(event.target.value);
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
          {/* From Address */}
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <TextField
                fullWidth
                label={t('fromAddress')}
                placeholder={t('exampleAddress')}
                onChange={handleAddressChange}
              />
            </FormControl>
          </Grid>
          {/* Amount */}
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <TextField
                fullWidth
                type="number"
                label="Amount"
                placeholder="ex. 10"
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
            endpoint={`${FF_Paths.nsPrefix}/${SELECTED_NAMESPACE}${FF_Paths.tokenBurn}`}
            payload={jsonPayload}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
