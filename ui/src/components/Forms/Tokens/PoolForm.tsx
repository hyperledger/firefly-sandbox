import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TUTORIAL_FORMS } from '../../../constants/TutorialSections';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FormContext } from '../../../contexts/FormContext';
import { DEFAULT_SPACING } from '../../../theme';

export const PoolForm: React.FC = () => {
  const { t } = useTranslation();
  const { multiparty, setJsonPayload, setPayloadMissingFields } =
    useContext(ApplicationContext);
  const { formID } = useContext(FormContext);
  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [address, setAddress] = useState<string | undefined>();
  const [publish, setPublish] = useState<boolean>(true);
  const [blockNumber, setBlockNumber] = useState('0');
  const [type, setType] = useState<'fungible' | 'nonfungible'>('fungible');

  useEffect(() => {
    if (formID !== TUTORIAL_FORMS.POOL) {
      setName('');
      setSymbol('');
      setAddress('');
      return;
    }
    setPayloadMissingFields(!name);
    setJsonPayload({
      name,
      symbol: symbol === '' ? null : symbol,
      type,
      address,
      blockNumber,
      publish: multiparty ? publish : undefined,
    });
  }, [name, symbol, type, address, formID, blockNumber, multiparty, publish]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.indexOf(' ') < 0) {
      setName(event.target.value);
    }
  };

  const handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.indexOf(' ') < 0) {
      setSymbol(event.target.value);
    }
  };

  const handleBlockNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.value.indexOf(' ') < 0) {
      setBlockNumber(event.target.value);
    }
  };

  return (
    <Grid container>
      <Grid container spacing={DEFAULT_SPACING}>
        <Grid container item justifyContent="space-between" spacing={1}>
          {/* Pool Name */}
          <Grid item xs={4}>
            <TextField
              required
              fullWidth
              label={t('poolName')}
              placeholder={t('acme')}
              value={name}
              onChange={handleNameChange}
            />
          </Grid>
          {/* Pool Symbol */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('poolSymbol')}
              placeholder={t('$acme')}
              value={symbol}
              onChange={handleSymbolChange}
            />
          </Grid>
          {/* Type */}
          <Grid item xs={4}>
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
        <Grid container item justifyContent="space-between" spacing={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('contractAddress')}
              placeholder={'0xabc123'}
              value={address ?? ''}
              onChange={(event) => {
                setAddress(event?.target.value);
              }}
              helperText={t('tokenPoolAddressHelperText')}
            />
          </Grid>
        </Grid>
        <Grid container item justifyContent="space-between" spacing={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('blockNumber')}
              value={blockNumber}
              onChange={handleBlockNumberChange}
              helperText={t('blockNumberDescription')}
            />
          </Grid>
        </Grid>
        {/* Publish */}
        {multiparty && (
          <Grid container item justifyContent="space-between" spacing={1}>
            <Grid item xs={12}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={publish}
                      onChange={() => {
                        setPublish(!publish);
                      }}
                    />
                  }
                  label={t('publishToNetwork')}
                />
                <FormHelperText>
                  {t('publishTokenPoolHelperText')}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
