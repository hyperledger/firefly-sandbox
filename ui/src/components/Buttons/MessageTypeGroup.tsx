import {
  Block,
  DataObject,
  FormatQuote,
  UploadFile,
} from '@mui/icons-material';
import {
  Button,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { POST_BODY_TYPE } from '../../enums/enums';
import { getTemplateCategory } from '../../pages/Home/views/MiddlePane';

export const DEFAULT_MESSAGE_STRING = 'This is a message';
export const DEFAULT_MESSAGE_JSON = {
  name: 'This is a message',
};

interface Props {
  message: string | undefined;
  jsonValue: string | undefined;
  recipients?: string[] | undefined;
  fileName?: string;
  onSetMessage: any;
  onSetFileName?: any;
  onSetJsonValue: any;
  noUndefined?: boolean;
}

export const MessageTypeGroup: React.FC<Props> = ({
  noUndefined = false,
  message,
  jsonValue,
  fileName,
  recipients,
  onSetMessage,
  onSetFileName,
  onSetJsonValue,
}) => {
  const { t } = useTranslation();
  const [messageType, setMessageType] = useState<POST_BODY_TYPE>(
    POST_BODY_TYPE.STRING
  );
  const { activeForm, setActiveForm, setPayloadMissingFields } =
    useContext(ApplicationContext);

  useEffect(() => {
    if (activeForm.indexOf('blob') < 0) {
      if (!message && !jsonValue) {
        onSetMessage(DEFAULT_MESSAGE_STRING);
      }
      setMessageType(message ? POST_BODY_TYPE.STRING : POST_BODY_TYPE.JSON);
      checkMissingFields();
    } else {
      const file: any = document.querySelector('input[type="file"]');
      setPayloadMissingFields(!file.files[0] ? true : false);
    }
  }, [activeForm]);

  useEffect(() => {
    if (getTemplateCategory(activeForm) !== 'messages') return;
    checkMissingFields();
  }, [message, jsonValue, messageType, fileName, recipients]);

  const checkMissingFields = () => {
    if (
      (activeForm.includes('private') && recipients?.length === 0) ||
      (!message && messageType === POST_BODY_TYPE.STRING) ||
      (!jsonValue && messageType === POST_BODY_TYPE.JSON) ||
      (messageType === POST_BODY_TYPE.FILE && !fileName)
    ) {
      setPayloadMissingFields(true);
    } else {
      setPayloadMissingFields(false);
    }
  };

  const handleMessageTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: POST_BODY_TYPE
  ) => {
    if (!newAlignment) {
      return;
    }
    setMessageType(newAlignment);
    switch (newAlignment) {
      case POST_BODY_TYPE.NONE:
        onSetMessage(undefined);
        if (activeForm.includes('blob')) {
          setActiveForm(activeForm.replace('blob', ''));
        }
        return;
      case POST_BODY_TYPE.STRING:
        onSetJsonValue(undefined);
        checkMissingFields();
        onSetMessage(DEFAULT_MESSAGE_STRING);
        if (activeForm.includes('blob')) {
          setActiveForm(activeForm.replace('blob', ''));
        }
        return;
      case POST_BODY_TYPE.JSON:
        onSetMessage(undefined);
        checkMissingFields();
        onSetJsonValue(JSON.stringify(DEFAULT_MESSAGE_JSON, null, 2));
        if (activeForm.includes('blob')) {
          setActiveForm(activeForm.replace('blob', ''));
        }
        return;
      case POST_BODY_TYPE.FILE:
        onSetMessage(undefined);
        onSetJsonValue(undefined);
        onSetFileName('');
        setActiveForm(
          activeForm.indexOf('blob') > -1 ? activeForm : activeForm + 'blob'
        );
        return;
      default:
        onSetMessage(DEFAULT_MESSAGE_STRING);
    }
  };

  return (
    <Grid container item xs={12} justifyContent="flex-end">
      {/* Body type selector */}
      <ToggleButtonGroup
        size="small"
        value={messageType}
        exclusive
        onChange={handleMessageTypeChange}
        sx={{ paddingBottom: 1 }}
      >
        {!noUndefined && (
          <ToggleButton value={POST_BODY_TYPE.NONE}>
            <Block />
          </ToggleButton>
        )}
        <ToggleButton value={POST_BODY_TYPE.STRING}>
          <FormatQuote />
        </ToggleButton>
        <ToggleButton value={POST_BODY_TYPE.JSON}>
          <DataObject />
        </ToggleButton>
        <ToggleButton value={POST_BODY_TYPE.FILE}>
          <UploadFile />
        </ToggleButton>
      </ToggleButtonGroup>
      {/* Text input, or file upload button */}
      {
        <Grid container item xs={12} pt={1}>
          {messageType !== POST_BODY_TYPE.FILE ? (
            <TextField
              label={t('message')}
              multiline
              required
              fullWidth
              maxRows={7}
              value={
                messageType === POST_BODY_TYPE.STRING
                  ? message
                  : jsonValue
                  ? jsonValue
                  : ''
              }
              onChange={(e) =>
                messageType === POST_BODY_TYPE.STRING
                  ? onSetMessage(e.target.value)
                  : onSetJsonValue(e.target.value)
              }
            />
          ) : (
            <Button
              variant="outlined"
              component="label"
              sx={{ textTransform: 'none', padding: '16px' }}
              fullWidth
            >
              <Typography sx={{ width: '50%' }}>{t('uploadFile')}*</Typography>
              <input
                type="file"
                required
                onChange={(event: any) => {
                  setPayloadMissingFields(false);
                  onSetFileName(event?.target?.files[0]?.name);
                }}
              />
            </Button>
          )}
        </Grid>
      }
    </Grid>
  );
};
