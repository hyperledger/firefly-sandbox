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
import RefreshIcon from '@mui/icons-material/Refresh';
import { FF_Paths } from '../../../constants/FF_Paths';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { ITokenPool, IVerifiers } from '../../../interfaces/api';
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../../theme';
import { fetchCatcher } from '../../../utils/fetches';
import {
  DEFAULT_MESSAGE_STRING,
  // MessageTypeGroup,
} from '../../Buttons/MessageTypeGroup';
import { TUTORIALS } from '../../../constants/TutorialSections';

export const DefineInterfaceForm: React.FC = () => {
  const { selfIdentity, jsonPayload, setJsonPayload, activeForm } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [recipient, setRecipient] = useState<string>('');

  const [message, setMessage] = useState<string | object | undefined>(
    DEFAULT_MESSAGE_STRING
  );

  const [pool, setPool] = useState<ITokenPool>();
  const [amount, setAmount] = useState<number>();
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    if (activeForm !== TUTORIALS.DEFINE_CONTRACT_INTERFACE) {
      return;
    }
    setJsonPayload({
      format: 'ffi',
      name: 'string',
      version: 'string',
      schema: 'string',
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
