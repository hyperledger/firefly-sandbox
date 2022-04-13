import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Button,
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
import { TUTORIALS } from '../../constants/TutorialSections';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { ITokenPool } from '../../interfaces/api';
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../theme';
import { fetchCatcher } from '../../utils/fetches';
import { DEFAULT_MESSAGE_STRING } from '../Buttons/MessageTypeGroup';

export const MintForm: React.FC = () => {
  const { selfIdentity, setJsonPayload, activeForm, setPayloadMissingFields } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  const [message] = useState<string | object | undefined>(
    DEFAULT_MESSAGE_STRING
  );

  const [pool, setPool] = useState<ITokenPool>();
  const [amount, setAmount] = useState<number>(1);
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    if (activeForm !== TUTORIALS.MINT) {
      setAmount(1);
      return;
    }
    setPayloadMissingFields(!amount);
    if (!message) {
      setJsonPayload({
        pool: pool?.name,
        amount: amount,
      });
      return;
    }
    setJsonPayload({
      pool: pool?.name,
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
    if (activeForm !== TUTORIALS.MINT) return;
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
  }, [activeForm]);

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

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value)) {
      setAmount(parseInt(event.target.value));
    }
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
        <Grid item xs={12} justifyContent={'space-between'}>
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
              type="number"
              label={t('amount')}
              placeholder={t('exampleAmount')}
              value={amount}
              onChange={handleAmountChange}
            />
          </FormControl>
        </Grid>
        {/* Message */}
        {/* <MessageTypeGroup
          message={message}
          onSetMessage={(msg: string) => setMessage(msg)}
        /> */}
      </Grid>
    </Grid>
  );
};
