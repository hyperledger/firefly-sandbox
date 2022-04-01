import {
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SELECTED_NAMESPACE } from '../../App';
import { FF_Paths } from '../../constants/FF_Paths';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { JsonPayloadContext } from '../../contexts/JsonPayloadContext';
import { DEFAULT_SPACING } from '../../theme';
import {
  DEFAULT_MESSAGE_STRING,
  MessageTypeGroup,
} from '../Buttons/MessageTypeGroup';
import { RunButton } from '../Buttons/RunButton';

export const PrivateForm: React.FC = () => {
  const { identities } = useContext(ApplicationContext);
  const { jsonPayload, setJsonPayload } = useContext(JsonPayloadContext);
  const { t } = useTranslation();
  const [message, setMessage] = useState<string | object>(
    DEFAULT_MESSAGE_STRING
  );
  const [recipients, setRecipients] = useState<string[]>([]);
  const [tag, setTag] = useState<string>();
  const [topics, setTopics] = useState<string[]>();

  useEffect(() => {
    setJsonPayload({
      header: {
        tag: tag,
        topics: topics,
      },
      data: [
        {
          value: message,
        },
      ],
      group: {
        members: recipients.map((r) => {
          return { identity: r };
        }),
      },
    });
  }, [message, recipients, tag, topics]);

  const handleRecipientChange = (
    event: SelectChangeEvent<typeof recipients>
  ) => {
    const {
      target: { value },
    } = event;
    setRecipients(typeof value === 'string' ? value.split(',') : value);
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setTag(undefined);
      return;
    }
    setTag(event.target.value);
  };

  const handleTopicsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setTopics(undefined);
      return;
    }
    setTopics([event.target.value]);
  };

  return (
    <Grid container>
      <Grid container spacing={DEFAULT_SPACING}>
        {/* Message */}
        <MessageTypeGroup
          noUndefined
          message={message}
          onSetMessage={(msg: string | object) => setMessage(msg)}
        />
        <Grid container item justifyContent="space-between" spacing={1}>
          {/* Tag */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('tag')}
              placeholder={t('exampleTag')}
              onChange={handleTagChange}
            />
          </Grid>
          {/* Topic */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('topic')}
              placeholder={t('exampleTopic')}
              onChange={handleTopicsChange}
            />
          </Grid>
        </Grid>
        <Grid container item>
          {/* Recipient Select box */}
          <FormControl fullWidth required>
            <InputLabel>{t('recipients')}</InputLabel>
            <Select
              multiple
              value={recipients}
              onChange={handleRecipientChange}
              input={<OutlinedInput label={t('recipients')} />}
              renderValue={(selected) => selected.join(', ')}
            >
              {identities.map((identity, idx) => (
                <MenuItem key={idx} value={identity.did}>
                  <Checkbox checked={recipients.indexOf(identity.did) > -1} />
                  <ListItemText primary={identity.did} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid container item justifyContent="flex-end">
          <RunButton
            endpoint={`${FF_Paths.nsPrefix}/${SELECTED_NAMESPACE}${FF_Paths.messagesPrivate}`}
            payload={jsonPayload}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
