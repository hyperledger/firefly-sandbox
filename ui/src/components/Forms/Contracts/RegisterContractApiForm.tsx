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
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../../theme';
import { fetchCatcher } from '../../../utils/fetches';
import {
  DEFAULT_MESSAGE_STRING,
  // MessageTypeGroup,
} from '../../Buttons/MessageTypeGroup';
import { TUTORIALS } from '../../../constants/TutorialSections';

export const RegisterContractApiForm: React.FC = () => {
  const { selfIdentity, jsonPayload, setJsonPayload, activeForm } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [contractInterfaces, setContractInterfaces] = useState<string[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [blockchainAddress, setBlockchainAddress] = useState<string>('');

  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    if (activeForm !== TUTORIALS.REGISTER_CONTRACT_API) {
      return;
    }
    setJsonPayload({
      name: 'string',
      interfaceName: 'string',
      interfaceVersion: 'string',
      address: 'string',
    });
  }, [activeForm]);

  return (
    <Grid container>
      <Grid container spacing={DEFAULT_SPACING}>
        <Grid container item justifyContent="space-between" spacing={1}>
          <Grid item width="100%">
            <FormControl
              fullWidth
              required
              disabled={contractInterfaces.length ? false : true}
            >
              <InputLabel>
                {contractInterfaces.length ? t('tokenPool') : t('noTokenPools')}
              </InputLabel>
              <Select
                fullWidth
                value={''}
                label={
                  contractInterfaces.length ? t('tokenPool') : t('noTokenPools')
                }
                onChange={(e) => {
                  return null;
                }}
              >
                {contractInterfaces.map((tp, idx) => (
                  <MenuItem key={idx} value={tp}>
                    <Typography color="text.disabled" fontSize="small">
                      {tp}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <TextField
              fullWidth
              type="number"
              label={t('name')}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <TextField
              fullWidth
              label={t('address')}
              onChange={(e) => setBlockchainAddress(e.target.value)}
            />
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};
