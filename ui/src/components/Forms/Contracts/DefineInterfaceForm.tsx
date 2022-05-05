import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MAX_FORM_ROWS } from '../../../App';
import { TUTORIAL_FORMS } from '../../../constants/TutorialSections';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FormContext } from '../../../contexts/FormContext';
import { BLOCKCHAIN_TYPE } from '../../../enums/enums';
import { altScrollbarStyle, DEFAULT_SPACING } from '../../../theme';
import { isJsonString } from '../../../utils/strings';
import { DefineInterfaceHelperText } from './DefineInterfaceHelperText';

export const DEFAULT_FFI_SCHEMA = {
  name: 'my-contract',
  version: '1.0',
  methods: [{ name: 'method1' }],
  events: [{ name: 'event1' }],
};

const DEFAULT_ABI_SCHEMA = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Changed',
    type: 'event',
  },
  {
    inputs: [],
    name: 'get',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'newValue', type: 'uint256' }],
    name: 'set',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const DefineInterfaceForm: React.FC = () => {
  const { blockchainPlugin, setJsonPayload, setPayloadMissingFields } =
    useContext(ApplicationContext);
  const { t } = useTranslation();
  const theme = useTheme();

  const [interfaceFormat, setInterfaceFormat] = useState<string>('ffi');
  const [name, setName] = useState<string>('');
  const [schema, setSchema] = useState<object>(DEFAULT_FFI_SCHEMA);
  const { formID } = useContext(FormContext);
  const [schemaString, setSchemaString] = useState<string>(
    JSON.stringify(DEFAULT_FFI_SCHEMA, null, 2)
  );
  const [version, setVersion] = useState<string>('');
  const [interfaceFormats, setInterfaceFormats] = useState(['ffi', 'abi']);

  useEffect(() => {
    if (formID !== TUTORIAL_FORMS.DEFINE_CONTRACT_INTERFACE) {
      return;
    }
    setPayloadMissingFields(
      !schema || (interfaceFormat === 'abi' && (!name || !version))
    );
    setJsonPayload({
      format: interfaceFormat,
      name,
      version,
      schema,
    });
  }, [interfaceFormat, schema, name, version, formID]);

  useEffect(() => {
    blockchainPlugin === BLOCKCHAIN_TYPE.FABRIC && setInterfaceFormats(['ffi']);
  }, [blockchainPlugin]);

  useEffect(() => {
    if (isJsonString(schemaString)) {
      setSchema(JSON.parse(schemaString));
      setPayloadMissingFields(!schemaString);
    }
  }, [schemaString]);

  useEffect(() => {
    const newSchema =
      interfaceFormat === 'ffi' ? DEFAULT_FFI_SCHEMA : DEFAULT_ABI_SCHEMA;
    setSchema(newSchema);
    setSchemaString(JSON.stringify(newSchema, null, 2));
  }, [interfaceFormat]);

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
                {interfaceFormats.map((f) => (
                  <MenuItem key={f} value={f}>
                    <Typography color="primary">{t(f)}</Typography>
                  </MenuItem>
                ))}
              </Select>
              <DefineInterfaceHelperText blockchainPlugin={blockchainPlugin} />
            </FormControl>
          </Grid>
        </Grid>

        {interfaceFormat === 'abi' ? (
          <>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <TextField
                  required
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
                  required
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
            inputProps={{ sx: { fontSize: '14px' } }}
            label={t('schema')}
            multiline
            required
            fullWidth
            maxRows={MAX_FORM_ROWS}
            value={schemaString}
            onChange={(e) => setSchemaString(e.target.value)}
            sx={{
              backgroundColor: theme.palette.background.paper,
              ...altScrollbarStyle,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
