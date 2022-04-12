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
  const { setJsonPayload, activeForm } = useContext(ApplicationContext);

  const [name, setName] = useState<string>();
  const [symbol, setSymbol] = useState<string>();
  const [type, setType] = useState<'fungible' | 'nonfungible'>('fungible');

  useEffect(() => {
    if (activeForm !== TUTORIALS.POOL) {
      return;
    }
    setJsonPayload({
      name: name,
      symbol: symbol,
      type: type,
    });
  }, [name, symbol, type, activeForm]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setName(undefined);
      return;
    }
    setName(event.target.value);
  };

  const handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setSymbol(undefined);
      return;
    }
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
              onChange={handleNameChange}
            />
          </Grid>
          {/* Pool Symbol */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('poolSymbol')}
              placeholder={t('abc')}
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
        </Grid>
      </Grid>
    </Grid>
  );
};
