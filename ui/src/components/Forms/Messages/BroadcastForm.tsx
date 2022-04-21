import { FormControl, Grid, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TUTORIAL_FORMS } from '../../../constants/TutorialSections';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FormContext } from '../../../contexts/FormContext';
import { IDatatype } from '../../../interfaces/api';
import { DEFAULT_SPACING } from '../../../theme';
import { isJsonString } from '../../../utils/strings';
import {
  DEFAULT_MESSAGE_STRING,
  MessageTypeGroup,
} from '../../Buttons/MessageTypeGroup';

export const BroadcastForm: React.FC = () => {
  const { jsonPayload, setJsonPayload } = useContext(ApplicationContext);
  const { formID, setFormParam, formObject, categoryID, setCategoryParam } =
    useContext(FormContext);
  const { t } = useTranslation();
  const [message, setMessage] = useState<string>(DEFAULT_MESSAGE_STRING);
  const [fileName, setFileName] = useState<string>('');
  const [tag, setTag] = useState<string>();
  const [topics, setTopics] = useState<string>();
  const [jsonValue, setJsonValue] = useState<string | undefined>();
  const [datatype, setDatatype] = useState<IDatatype | undefined>();

  useEffect(() => {
    if (formID !== TUTORIAL_FORMS.BROADCAST) return;
    const { jsonValue: jsonCurValue } = jsonPayload as any;
    setJsonPayload({
      topic: topics,
      tag,
      value: message,
      jsonValue: jsonValue && !message ? jsonCurValue : null,
      filename: fileName,
      datatypename: datatype?.name ?? '',
      datatypeversion: datatype?.version ?? '',
    });
  }, [message, tag, topics, fileName, formID, datatype]);

  useEffect(() => {
    if (jsonValue && isJsonString(jsonValue)) {
      setJsonValue(JSON.stringify(JSON.parse(jsonValue), null, 2));
      setMessage('');
      setJsonPayload({
        topic: topics,
        tag,
        jsonValue: JSON.parse(jsonValue),
        value: message,
        filename: fileName,
        datatypename: datatype?.name ?? '',
        datatypeversion: datatype?.version ?? '',
      });
    }
  }, [jsonValue]);

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
    setTopics(event.target.value);
  };

  return (
    <Grid width={'100%'} container>
      <FormControl>
        <Grid container spacing={DEFAULT_SPACING}>
          {/* Message */}
          <MessageTypeGroup
            noUndefined
            datatype={datatype}
            message={message}
            jsonValue={jsonValue}
            onSetMessage={(msg: string) => {
              setMessage(msg);
            }}
            onSetFileName={(file: string) => {
              setFileName(file);
            }}
            onSetJsonValue={(json: string) => {
              setJsonValue(json);
            }}
            onSetDatatype={(dt: IDatatype) => {
              setDatatype(dt);
            }}
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
        </Grid>
      </FormControl>
    </Grid>
  );
};
