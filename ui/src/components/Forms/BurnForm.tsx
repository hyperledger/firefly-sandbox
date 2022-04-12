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
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { ITokenPool } from '../../interfaces/api';
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../theme';
import { fetchCatcher } from '../../utils/fetches';
import RefreshIcon from '@mui/icons-material/Refresh';
import { TUTORIALS } from '../../constants/TutorialSections';

export const BurnForm: React.FC = () => {
  const { selfIdentity, jsonPayload, setJsonPayload, activeForm } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [pool, setPool] = useState<ITokenPool>();
  const [amount, setAmount] = useState<number>(0);
  const [tokenIndex, setTokenIndex] = useState<string | null>();
  const [refresh, setRefresh] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  useEffect(() => {
    if (activeForm !== TUTORIALS.BURN) return;
    setJsonPayload({
      pool: pool?.name,
      amount,
      tokenIndex,
    });
  }, [pool, amount, tokenIndex, activeForm]);

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

  useEffect(() => {
    setTokenIndex(isFungible() ? null : '1');
    if (!isFungible()) {
      setAmount(1);
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
        <Grid container item justifyContent="space-between" spacing={1}>
          {/* From Address */}
          {/* Amount */}
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <TextField
                fullWidth
                disabled={!isFungible()}
                value={amount}
                type="number"
                label="Amount"
                placeholder="ex. 10"
                onChange={handleAmountChange}
              />
            </FormControl>
          </Grid>
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
      </Grid>
    </Grid>
  );
};
