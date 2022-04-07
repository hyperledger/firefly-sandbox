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
import { SELECTED_NAMESPACE } from '../../App';
import { FF_Paths } from '../../constants/FF_Paths';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { JsonPayloadContext } from '../../contexts/JsonPayloadContext';
import { DEFAULT_SPACING } from '../../theme';
import { RunButton } from '../Buttons/RunButton';

export const PoolForm: React.FC = () => {
  const { t } = useTranslation();
  const { connectors } = useContext(ApplicationContext);
  const { jsonPayload, setJsonPayload, activeForm } =
    useContext(JsonPayloadContext);

  const [connector, setConnector] = useState<string>(
    connectors.length > 0 ? connectors[0].name : t('noConnectors')
  );
  const [name, setName] = useState<string>();
  const [symbol, setSymbol] = useState<string>();
  const [type, setType] = useState<'fungible' | 'nonfungible'>('fungible');

  useEffect(() => {
    if (activeForm !== 'createPool') {
      return;
    }
    setJsonPayload({
      connector: connector,
      name: name,
      symbol: symbol,
      type: type,
    });
  }, [connector, name, symbol, type, activeForm]);

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
        <Grid container item justifyContent="flex-end">
          <RunButton
            endpoint={`${FF_Paths.nsPrefix}/${SELECTED_NAMESPACE}${FF_Paths.tokenPools}`}
            payload={jsonPayload}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
