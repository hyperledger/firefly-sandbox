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

export const CONTRACT_INTERFACE_FORMATS = ['ffi', 'abi'];

export const DefineInterfaceForm: React.FC = () => {
  const { setJsonPayload, activeForm } = useContext(ApplicationContext);
  const { t } = useTranslation();

  const [interfaceFormat, setInterfaceFormat] = useState<string>('ffi');
  const [, setName] = useState<string>('');
  const [schema, setSchema] = useState<string>('');
  const [, setVersion] = useState<string>('');

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

  return (
    <Grid container>
      <Grid container spacing={DEFAULT_SPACING}>
        <Grid container item justifyContent="space-between" spacing={1}>
          <Grid item width="100%">
            <FormControl fullWidth required>
              <InputLabel>{t('interfaceFormat')}</InputLabel>
              <Select
                fullWidth
                value={interfaceFormat}
                label={t('interfaceFormat')}
                onChange={(e) => setInterfaceFormat(e.target.value)}
              >
                {CONTRACT_INTERFACE_FORMATS.map((f, idx) => (
                  <MenuItem key={idx} value={f}>
                    <Typography color="primary">{t(`${f}`)}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {interfaceFormat === 'abi' ? (
          <>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <TextField
                  fullWidth
                  label={t('name')}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <TextField
                  fullWidth
                  label={t('version')}
                  onChange={(e) => {
                    setVersion(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
          </>
        ) : (
          <></>
        )}
        <Grid item xs={12}>
          <TextField
            label={t('schema')}
            multiline
            required
            fullWidth
            maxRows={40}
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
          />
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
