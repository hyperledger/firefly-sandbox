import { FormControl, Grid, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DEFAULT_SPACING } from '../../../theme';
import { TUTORIALS } from '../../../constants/TutorialSections';
import { isJsonString } from '../../../utils/strings';

const DEFAULT_DATATYPE_SCHEMA = {
  $id: 'https://example.com/person.schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Person',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'The unique identifier for the person.',
    },
    name: {
      type: 'string',
      description: "The person's last name.",
    },
    age: {
      type: 'integer',
      description: "The person's age in years.",
    },
    isEnrolled: {
      type: 'boolean',
      description: "The person's enrollment in the program",
    },
    rating: {
      type: 'number',
      description:
        "The person's overall score in the program (e.g. 87.5, 100).",
    },
  },
};

export const DefineDatatypeForm: React.FC = () => {
  const { setJsonPayload, activeForm, setPayloadMissingFields } =
    useContext(ApplicationContext);
  const { t } = useTranslation();

  const [name, setName] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [schema, setSchema] = useState<object>(DEFAULT_DATATYPE_SCHEMA);
  const [schemaString, setSchemaString] = useState<string>(
    JSON.stringify(DEFAULT_DATATYPE_SCHEMA, null, 2)
  );

  useEffect(() => {
    if (activeForm !== TUTORIALS.DATATYPE) {
      setName('');
      setVersion('');
      return;
    }
    setPayloadMissingFields(!schema || !name || !version);
    setJsonPayload({
      name,
      version,
      schema,
    });
  }, [schema, name, version, activeForm]);

  useEffect(() => {
    if (isJsonString(schemaString)) {
      setSchema(JSON.parse(schemaString));
      setPayloadMissingFields(!schemaString);
    }
  }, [schemaString]);

  return (
    <Grid container>
      <Grid container spacing={DEFAULT_SPACING}>
        <Grid item xs={6}>
          <FormControl fullWidth required>
            <TextField
              required
              fullWidth
              value={name}
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
              value={version}
              onChange={(e) => {
                setVersion(e.target.value);
              }}
            />
          </FormControl>
        </Grid>

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
      </Grid>
    </Grid>
  );
};
