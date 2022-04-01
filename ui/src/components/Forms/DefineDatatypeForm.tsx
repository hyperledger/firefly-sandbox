import { FormControl, Grid, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { SELECTED_NAMESPACE } from '../../App';
import { FF_Paths } from '../../constants/FF_Paths';
import { JsonPayloadContext } from '../../contexts/JsonPayloadContext';
import { DEFAULT_SPACING } from '../../theme';
import { RunButton } from '../Buttons/RunButton';

export const DefineDatatypeForm: React.FC = () => {
  const { jsonPayload, setJsonPayload } = useContext(JsonPayloadContext);

  const [datatype, setDatatype] = useState<object>({
    $id: 'https://example.com/widget.schema.json',
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'Widget',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The unique identifier for the widget.',
      },
      name: {
        type: 'string',
        description: "The person's last name.",
      },
    },
  });
  const [name, setName] = useState<string>('');
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    setJsonPayload({
      name: name,
      version: version,
      value: datatype,
    });
  }, [datatype, name, version]);

  return (
    <Grid width={'100%'} container>
      <FormControl>
        <Grid container spacing={DEFAULT_SPACING}>
          <Grid container item xs={12} justifyContent="flex-end">
            <TextField
              label="Datatype"
              multiline
              required
              fullWidth
              maxRows={21}
              value={JSON.stringify(datatype, null, 2)}
              onChange={(e) => setDatatype(JSON.parse(e.target.value))}
            />
          </Grid>
          <Grid container item justifyContent="space-between" spacing={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Name"
                placeholder="ex. widget"
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Version"
                placeholder="ex. 0.2.0"
                onChange={(e) => setVersion(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item justifyContent="flex-end">
            <RunButton
              endpoint={`${FF_Paths.nsPrefix}/${SELECTED_NAMESPACE}${FF_Paths.datatypes}`}
              payload={jsonPayload}
            />
          </Grid>
        </Grid>
      </FormControl>
    </Grid>
  );
};
