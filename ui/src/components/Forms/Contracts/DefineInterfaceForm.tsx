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
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DEFAULT_SPACING } from '../../../theme';
import { TUTORIALS } from '../../../constants/TutorialSections';
import { isJsonString } from '../../../utils/strings';

export const CONTRACT_INTERFACE_FORMATS = ['ffi', 'abi'];
const DEFAULT_FFI_SCHEMA = {
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
  const { setJsonPayload, activeForm, setPayloadMissingFields } =
    useContext(ApplicationContext);
  const { t } = useTranslation();

  const [interfaceFormat, setInterfaceFormat] = useState<string>('ffi');
  const [name, setName] = useState<string>('');
  const [schema, setSchema] = useState<object>(DEFAULT_FFI_SCHEMA);
  const [schemaString, setSchemaString] = useState<string>(
    JSON.stringify(DEFAULT_FFI_SCHEMA, null, 2)
  );
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    if (activeForm !== TUTORIALS.DEFINE_CONTRACT_INTERFACE) {
      return;
    }
    setPayloadMissingFields(!schema);
    setJsonPayload({
      format: interfaceFormat,
      name,
      version,
      schema,
    });
  }, [interfaceFormat, schema, name, version, activeForm]);

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
            label={t('schema')}
            multiline
            required
            fullWidth
            maxRows={40}
            value={schemaString}
            onChange={(e) => setSchemaString(e.target.value)}
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
