import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TUTORIALS } from '../../constants/TutorialSections';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { DEFAULT_SPACING } from '../../theme';

export const PoolForm: React.FC = () => {
  const { t } = useTranslation();
  const { setJsonPayload, activeForm, setPayloadMissingFields } =
    useContext(ApplicationContext);

  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [address, setAddress] = useState<string | undefined>();
  const [type, setType] = useState<'fungible' | 'nonfungible'>('fungible');

  useEffect(() => {
    if (activeForm !== TUTORIALS.POOL) {
      setName('');
      setSymbol('');
      return;
    }
    setPayloadMissingFields(!name || !symbol ? true : false);
    setJsonPayload({
      name,
      symbol,
      type,
      address,
    });
  }, [name, symbol, type, activeForm]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(event.target.value);
  };

  return (
    <Grid container>
      <Grid container spacing={DEFAULT_SPACING}>
        <Grid container item justifyContent="space-between" spacing={1}>
          {/* Pool Name */}
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label={t('poolName')}
              placeholder={t('abcCoin')}
              value={name}
              onChange={handleNameChange}
            />
          </Grid>
          {/* Pool Symbol */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              label={t('poolSymbol')}
              placeholder={t('abc')}
              value={symbol}
              onChange={handleSymbolChange}
            />
          </Grid>
        </Grid>
        <Grid container item justifyContent="space-between" spacing={1}>
          {/* Type */}
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('type')}</InputLabel>
              <Select
                value={type}
                label={t('type')}
                onChange={(e) =>
                  setType(e.target.value as 'fungible' | 'nonfungible')
                }
              >
                <MenuItem value={'fungible'}>{t('fungible')}</MenuItem>
                <MenuItem value={'nonfungible'}>{t('nonfungible')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('contractAddress')}
              placeholder={'0xabc123'}
              value={address ?? ''}
              onChange={(event) => {
                setAddress(event?.target.value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
