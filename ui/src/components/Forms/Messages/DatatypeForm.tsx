import { FormControl, Grid, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DEFAULT_SPACING } from '../../../theme';
import { TUTORIAL_FORMS } from '../../../constants/TutorialSections';
import { isJsonString } from '../../../utils/strings';
import { FormContext } from '../../../contexts/FormContext';
import { MAX_FORM_ROWS } from '../../../App';

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

export const DatatypeForm: React.FC = () => {
  const { setJsonPayload, setPayloadMissingFields } =
    useContext(ApplicationContext);
  const { formID } = useContext(FormContext);
  const { t } = useTranslation();

  const [name, setName] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [schema, setSchema] = useState<object>(DEFAULT_DATATYPE_SCHEMA);
  const [schemaString, setSchemaString] = useState<string>(
    JSON.stringify(DEFAULT_DATATYPE_SCHEMA, null, 2)
  );

  useEffect(() => {
    if (formID !== TUTORIAL_FORMS.DATATYPE) {
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
  }, [schema, name, version, formID]);

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
            label={t('jsonSchema')}
            multiline
            required
            fullWidth
            maxRows={MAX_FORM_ROWS}
            value={schemaString}
            onChange={(e) => setSchemaString(e.target.value)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
