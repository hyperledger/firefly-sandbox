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
import { TUTORIALS } from '../../../constants/TutorialSections';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DEFAULT_SPACING } from '../../../theme';

export const RegisterContractApiForm: React.FC = () => {
  const { setJsonPayload, activeForm } = useContext(ApplicationContext);
  const { t } = useTranslation();

  const [contractInterfaces] = useState<string[]>([]);
  const [, setName] = useState<string>('');
  const [, setBlockchainAddress] = useState<string>('');

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
                onChange={() => {
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
