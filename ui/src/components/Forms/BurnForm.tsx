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
import { FF_Paths } from '../../constants/FF_Paths';
import { JsonPayloadContext } from '../../contexts/JsonPayloadContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { ITokenPool } from '../../interfaces/api';
import { DEFAULT_SPACING } from '../../theme';
import { fetchCatcher } from '../../utils/fetches';
import { RunButton } from '../Buttons/RunButton';

export const BurnForm: React.FC = () => {
  const { jsonPayload, setJsonPayload, activeForm } =
    useContext(JsonPayloadContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [pool, setPool] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const [tokenIndex, setTokenIndex] = useState<string>();

  useEffect(() => {
    if (activeForm !== 'burn') return;
    setJsonPayload({
      pool: pool,
      amount,
      tokenIndex,
    });
  }, [pool, amount, tokenIndex, activeForm]);

  useEffect(() => {
    const qParams = `?limit=25`;
    fetchCatcher(`${FF_Paths.tokenPools}${qParams}`)
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
    setAmount(parseInt(event.target.value));
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
        <Grid container item justifyContent="space-between" spacing={1}>
          {/* From Address */}
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
        <Grid container item justifyContent="flex-end">
          <RunButton endpoint={`${FF_Paths.tokenBurn}`} payload={jsonPayload} />
        </Grid>
      </Grid>
    </Grid>
  );
};
